import Papa from 'papaparse';

export function dataProcessing( textData ){

  const result = Papa.parse(textData, {
    header: false,        // 第一列作為物件的 Key
    dynamicTyping: true,  // 自動將 "25" 轉成數字 25
    skipEmptyLines: true  // 忽略空白行
  });

  const rows = result.data; // 取得二維陣列資料 (未分析過的資料)
  let data = [];      // 存入用

  if (rows.length === 0) return data;  //如果解析出來的 CSV 資料是空的，就立刻停止並直接傳回 data (空值)


  // 譜面偏移_第一行=========================================
  const chartOffset = rows[0][0];

  // 第一個note的軌道_第二行================================
  const startLand = Number(rows[1]?.[0]);

  // 從第三行開始讀取資料 (i = 2)============================
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const type = row[0]; // 第一欄：類型

    if (type === 'note') {
      let time = (row[1] || 0) + chartOffset;
      let land = row[2];
      data.push({ type, time, land });
    } 
    else if (type === 'drag') {
      let timeStart = (row[1] || 0) + chartOffset;
      let timeEnd = (row[2] || 0) + chartOffset;
      let landStart = row[3];
      let landEnd = row[4];
      let direction = row[5];
      data.push({ type, timeStart, timeEnd, landStart, landEnd, direction });
    } 
    else if (type === 'rotate') {
      let time = (row[1] || 0) + chartOffset;
      let direction = row[2];
      data.push({ type, time, direction });
    }
  }

  const processedChart = data.map((item) => {
    if (item.type === 'drag') {
      return {
        ...item,
        startPosition: 10,
        endPosition: 4,
        lifePosition: 4 - 0.5,
        notePosition: 5,
        segment: Array.from({ length: 10 + 1 }, () => ({ isActive: false }))
      };
    } else {
      return {
        ...item,
        startPosition: 10,
        endPosition: 4,
        lifePosition: 4 - 0.5,
        notePosition: 5,
        isActive: false,
      };
    }
  });

  return { processedChart, startLand, chartOffset };
}

