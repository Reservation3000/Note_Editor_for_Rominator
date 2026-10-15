import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import { Howl } from 'howler';
import { musicTimeZ } from '../store';

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
      setCsvData(processedChart);                                     // 譜面
      setStartLand(Number.isFinite(startLand) ? startLand : 0);       // 第一條軌道
      setChartOffest(Number.isFinite(chartOffset) ? chartOffset : 0); // 偏移

    } catch (error) {
      console.error('get file error:', error);
    }

}

// music===============================================================================
export function MusicController( musicUrl, setStop, stop, setMusicDuration){
  const soundRef = useRef(null);

  useEffect(() => {
    if (!musicUrl) return undefined;

    let animationFrameId;
    const sound = new Howl({
      src: [musicUrl],
      format: ['mp3'],
      html5: false,
      autoplay: false,
      onload: () => setMusicDuration(sound.duration() * 1000),
      onend: () => {
        musicTimeZ.getState().setMusicTime(sound.duration() * 1000);
        setStop(true);
      },
      onloaderror: (_id, error) => console.error('music load error:', error),
    });
    soundRef.current = sound;


    const updateTime = () => {
      if (sound.playing()) {
        musicTimeZ.getState().setMusicTime(sound.seek() * 1000);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };

    updateTime(); // 觸發循環

    musicTimeZ.getState().setMusicSeek((timeMs) => sound.seek(timeMs / 1000));

    return () => {
      cancelAnimationFrame(animationFrameId);
      sound.unload();
      soundRef.current = null;
      URL.revokeObjectURL(musicUrl);
      setMusicDuration(0);
      musicTimeZ.getState().setMusicTime(0);
      musicTimeZ.getState().setMusicSeek(() => {});
    };
  }, [musicUrl, setStop, setMusicDuration]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound || !musicUrl) return;

    if (stop && sound.playing()) {
      sound.pause();
    } else if (!stop && !sound.playing()) {
      sound.play();
    }
  }, [musicUrl, stop]);

}

export function MusicChose( e , setStop , setFileName , setMusicUrl, setMusicDuration ){

    const file = e.target.files[0];
    if (!file) return;

    setStop(true);        // 暫停狀態
    musicTimeZ.getState().setMusicTime(0);
    setMusicDuration(0);
    setFileName(file.name);  //在畫面中顯示檔名
    const url = URL.createObjectURL(file); //記憶體中存入一個臨時的本地音樂網址
    
    setMusicUrl(url);

}

export function MusicTimeInput(){
  const musicTime = musicTimeZ((state) => state.musicTime);
  const duration = musicTimeZ((state) => state.musicDuration);
  const musicSeek = musicTimeZ((state) => state.musicSeek);
  const [inputTime, setInputTime] = useState(Math.floor(musicTime));
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) setInputTime(Math.floor(musicTime));
  }, [musicTime]);

  const startEditing = () => {
    isEditingRef.current = true;
  };

  const seekToInputTime = () => {
    isEditingRef.current = false;

    if (inputTime === null || !Number.isFinite(inputTime)) {
      setInputTime(Math.floor(musicTimeZ.getState().musicTime));
      return;
    }

    const time = Math.floor(Math.min(Math.max(inputTime, 0), duration));
    musicSeek(time);
    musicTimeZ.getState().setMusicTime(time);
    setInputTime(time);
  };

  return { duration, inputTime, seekToInputTime, setInputTime, startEditing };
}

