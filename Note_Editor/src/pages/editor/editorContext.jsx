import { createContext, useContext, useMemo } from 'react';

const editorContext = createContext();

export const EditorProvider = ({ musicDuration, bpm, beat, signature, aBeatPx, children }) => {

  const rhythmData = useMemo(() => {

    const beatPx = aBeatPx * 0.002;       //每毫秒走幾像素
    const musicPx = musicDuration * beatPx;   //整首歌有幾像素
    const aBeatDuration = (60000 / bpm) * (4 / beat);   //一拍幾毫秒
    const aBarDuration = aBeatDuration * signature;   //一小節幾毫秒
    const howManyBeat = Math.ceil(musicDuration / aBeatDuration);   //有多少拍(非整除)
    const howManyBar = Math.ceil(musicDuration / aBarDuration);    //有多少小節(非整除)

    return {
      musicDuration, bpm, beat, signature, aBeatPx, // 原始資料如果需要也可以傳下去
      beatPx,
      musicPx,
      aBeatDuration,
      aBarDuration,
      howManyBeat,
      howManyBar,
    };
  }, [musicDuration, bpm, beat, signature, aBeatPx]); 

  return (
    <editorContext.Provider value={rhythmData}>
      {children}
    </editorContext.Provider>
  );
};

export const UseRhythm = () => useContext(editorContext);