import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import { musicTimeZ } from '../store';

import { limitRange , formatTime } from '../math.js'
import { Howl } from 'howler';

// csv data===========================================================================
function dataProcessing( textData ){

  const result = Papa.parse(textData, {
    header: false,        // 第一列作為物件的 Key
    dynamicTyping: true,  // 自動將 "25" 轉成數字 25
    skipEmptyLines: true  // 忽略空白行
  });

  const rows = result.data; // 取得二維陣列資料 (未分析過的資料)
  let data = [];      // 存入用

  if (rows.length === 0) return data;  //如果解析出來的 CSV 資料是空的，就立刻停止並直接傳回 data (空值)


  // 譜面偏移_第一行=========================================
  const chartOffset = Number(rows[0][0]) || 0;

  // 第一個note的軌道_第二行================================
  const startLand = Math.round(Number(rows[1]?.[0]) || 0);

  // 從第三行開始讀取資料 (i = 2)============================
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const type = row[0]; // 第一欄：類型

    if (type === 'note') {
      let time = Math.round((Number(row[1]) || 0) + chartOffset);
      let land = Math.round(Number(row[2]) || 0);
      data.push({ type, time, land });
    } 
    else if (type === 'drag') {
      let timeStart = Math.round((Number(row[1]) || 0) + chartOffset);
      let timeEnd = Math.round((Number(row[2]) || 0) + chartOffset);
      let landStart = Math.round(Number(row[3]) || 0);
      let landEnd = Math.round(Number(row[4]) || 0);
      let direction = Math.round(Number(row[5]) || 0);
      data.push({ type, timeStart, timeEnd, landStart, landEnd, direction });
    } 
    else if (type === 'rotate') {
      let time = Math.round((Number(row[1]) || 0) + chartOffset);
      let direction = Math.round(Number(row[2]) || 0);
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

export async function DataGet( file, setCsvData , setStartLand , setChartOffest ){
  try {
      const textData = await file.text();  // 取得檔案的純文字內容（適用於 CSV, TXT, JSON 等）
      
      const { processedChart, startLand, chartOffset } = dataProcessing(textData); // 處理csv資料，並解構取得三個變數

      console.log(dataProcessing(textData));

      // 把三個變數資料存進state
      setCsvData(processedChart);   // 譜面
      setStartLand(startLand);      // 第一條軌道
      setChartOffest(chartOffset ); // 偏移

      console.log('csv data:', processedChart);

    } catch (error) {
      console.error('get file error:', error);
    }

}
  
// music===============================================================================

export function MusicPlay( setStop , setMusicDuration , musicUrl , stop ){
  
  const musicView = musicTimeZ((state) => state.musicView); 
  const setMusicView = musicTimeZ((state) => state.setMusicView); 
  const musicInstance = musicTimeZ((state) => state.musicInstance);
  const setMusicInstance = musicTimeZ((state) => state.setMusicInstance);

  const formattedTime = formatTime(musicView);

  // const musicRef = useRef(null);       // 音樂物件的參考
  const rAFRef = useRef(null);         // requestAnimationFrame 的 ID
  const isDraggingRef = useRef(false); // 是否正在拖曳滑桿

  useEffect(() => {
    if (!musicUrl) {
      setMusicDuration(0);
    }

    const music = new Howl({
      src: [musicUrl],
      format: ['mp3'],
      html5: false,
      preload: true,
      onload: () => { setMusicDuration(music.duration() * 1000); },
      onloaderror: (_id, error) => console.error('music load error:', error),
    });

    setMusicInstance(music);

    setMusicView(0);
    setMusicInstance(music);

    // 組件卸載時清除
    return () => {
      music.unload();  
      setMusicInstance(null);
    };
  }, [musicUrl, setMusicDuration]);

  useEffect(() => {
    if (!musicInstance) return;

    if (stop) {
      musicInstance.pause();
    } else {
      musicInstance.play();
    }
  }, [stop, musicInstance]);

  useEffect(() => {
    const updateProgress = () => {

      if (musicInstance.playing() && !isDraggingRef.current) {
        setMusicView(musicInstance.seek() * 1000);
      }
      rAFRef.current = requestAnimationFrame(updateProgress);
    };

    rAFRef.current = requestAnimationFrame(updateProgress);

    // 組件卸載時清除
    return () => { 
      cancelAnimationFrame(rAFRef.current); 
    };
  }, [setMusicView, musicInstance]); 

  // 拖曳中
  const handleSliderChange = (newValue) => {
    isDraggingRef.current = true;
    musicInstance.seek(newValue / 1000); // 改變音軌
    setMusicView(newValue);       // 畫面立即跟著滑鼠走
  };

  // 拖曳結束
  const handleSliderAfterChange = (newValue) => {
    if (musicInstance) {
      musicInstance.seek(newValue / 1000); // 改變音軌
    }
    isDraggingRef.current = false;
  };

  return { handleSliderChange, handleSliderAfterChange, formattedTime, musicView };

}

export function MusicChose( e , setStop , setFileName , setMusicUrl, setMusicDuration ){

    const file = e.target.files[0];
    if (!file) return;

    setStop(true);        // 暫停狀態
    setMusicDuration(0);
    setFileName(file.name);  //在畫面中顯示檔名
    const url = URL.createObjectURL(file); //記憶體中存入一個臨時的本地音樂網址
    
    setMusicUrl(url);

}

export function MusicTimeInput( musicDuration ){

  const musicView = musicTimeZ((state) => state.musicView);
  const setMusicView = musicTimeZ((state) => state.setMusicView);

  const [inputTime, setInputTime] = useState(Math.floor(musicView)); // 輸入的數值
  const isEditingRef = useRef(false); //是否正在輸入

  useEffect(() => {
    if (!isEditingRef.current) setInputTime(Math.floor(musicView));
  }, [musicView]);

  const handleOnFocus = () => {
    isEditingRef.current = true;
  };

  const seekToInputTime = () => {
    isEditingRef.current = false;

    // 如果沒有輸入東西，或輸入的不是有效數字，則時間返回現在撥放的時間
    if (inputTime === null || !Number.isFinite(inputTime)) {
      setInputTime(Math.floor(musicTimeZ.getState().musicView));
      return;
    } 
    else {
      const time = limitRange( musicDuration, 0, inputTime );
      setMusicView(time);
      setInputTime(time);
    }
  };

  return { inputTime, handleOnFocus, seekToInputTime, setInputTime };
}
