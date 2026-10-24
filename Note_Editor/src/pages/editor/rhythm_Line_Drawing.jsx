
import { Group, Stage, Layer, Line, Text, RegularPolygon } from 'react-konva';
import { EditorProvider, UseRhythm } from './editorContext.jsx';
import { limitRange, widthToTime, timeToWidth } from '../../math.js';
import { musicTimeZ } from '../../store.js';
import { useState } from 'react';

// 時間尺
const TimeRuler = () => {

  const { 
    musicPx, //整首歌有幾像素
    howManyBar, //有多少小節(非整除)
    aBarDuration, //一小節幾毫秒
    beatPx,   //每毫秒走幾像素
  } = UseRhythm();

  const TRACK_HEIGHT = 30; // 軌道高度

  const barPositions = Array.from({ length: howManyBar + 1 }, (_, i) => Math.floor((i * aBarDuration) * beatPx));
  const barTimmings = Array.from({ length: howManyBar + 1 }, (_, i) => Math.floor((i * aBarDuration)));

  return (
    <Stage width={musicPx} height={TRACK_HEIGHT}>
          <Layer>
            {barPositions.map((x, i) => <Text key={`timing-${i}`} text={`${barTimmings[i]}`} 
                                                  x={(x-15)} y={15}
                                                  fontSize={11}  fill="white" draggable
                                                  />
            )}
            <Text text="0" x={0} y={14} fontSize={11}  fill="white" draggable/>
          </Layer>
        </Stage>
  );
}

// 時間標記
const TimmingMarker = () => {

  // howManyBar, //有多少小節(非整除)
    // aBarDuration, //一小節幾毫秒
    // beatPx,   //每毫秒走幾像素
    // howManyBeat, //有多少拍(非整除)
    // aBeatDuration, //一拍幾毫秒

  const setMusicView = musicTimeZ((state) => state.setMusicView); // 訂閱音樂時間set
  const musicView = musicTimeZ((state) => state.musicView);       // 訂閱音樂時間
  const musicInstance = musicTimeZ((state) => state.musicInstance); // 訂閱音樂物件set
  const [isHover , setIsHover] = useState(false);               // 是否懸停
  const { musicPx, musicDuration } = UseRhythm();               //整首歌有幾像素  //整首歌有幾毫秒
  const [isDragging, setIsDragging] = useState(false);          // 是否正拖曳
  const TRACK_HEIGHT = 590;                                     // 軌道高度
  const limitX = (x) => { return limitRange(musicPx, 0, x); }   //限制移動範圍在0~musicPx之間
  const positionX = timeToWidth(musicView, musicDuration, musicPx); // 計算位置


  const handleStart = (event) => {
    setIsDragging(true);
    const time = Math.floor(widthToTime(musicPx, musicDuration)(event.target.x()));

    setMusicView(time);
    musicInstance?.seek(time / 1000);
  }
 
  const handleMove = (event) => {
    if (isDragging) {
      const time = Math.floor(widthToTime(musicPx, musicDuration)(event.target.x()));

      setMusicView(time);
      musicInstance?.seek(time / 1000);
    }
  }

  const handleEnd = () => { setIsDragging(false);  }


  return (
    <Stage width={musicPx} height={TRACK_HEIGHT} >
      <Layer>
        <Group x={positionX}      // 位置
               draggable          // 啟用拖曳
               dragBoundFunc={(position) => ({ x: limitX(position.x) , y: 0 })}  // 限制拖曳範圍
               onDragStart={handleStart}
               onDragMove={handleMove}
               onDragEnd={handleEnd}
               onMouseEnter={() => setIsHover(true)}
               onMouseLeave={() => setIsHover(false)}
        >

            <Line points={[0, 0, 0, TRACK_HEIGHT]} stroke={isHover ? "rgb(255, 243, 82)" : "white"} strokeWidth={2} />
            <RegularPolygon x={0} y={4} sides={3} radius={8} rotation={180} fill={isHover ? "rgb(255, 243, 82)" : "white"} />

          </Group>
        </Layer>
      </Stage>
  );
}

// 音樂軌道線繪製
const RhythmLineDrawing = () => {

  const { 
    musicPx, //整首歌有幾像素
    howManyBar, //有多少小節(非整除)
    aBarDuration, //一小節幾毫秒
    beatPx,   //每毫秒走幾像素
    howManyBeat, //有多少拍(非整除)
    aBeatDuration, //一拍幾毫秒
  } = UseRhythm();
  
  // console.log('RhythmLineDrawing', musicPx, howManyBar, aBarDuration, beatPx, howManyBeat, aBeatDuration );

  const TRACK_HEIGHT = 590; // 軌道高度
  const laneHeight = TRACK_HEIGHT / 32; //每個軌道長度

  const barPositions = Array.from({ length: howManyBar + 1 }, (_, i) => (i * aBarDuration) * beatPx);
  const beatPositions = Array.from({ length: howManyBeat }, (_, i) => (i * aBeatDuration) * beatPx);
  const landPositions = Array.from({ length: 31 + 1 }, (_, i) => i *laneHeight);

  return (
    <Stage width={musicPx} height={TRACK_HEIGHT}>
          <Layer>

            <Line points={[0, 0, musicPx, 0]} stroke="white" strokeWidth={2}/>

            {barPositions.map((x, i) => <Line key={`bar-${i}`} points={[x, 0, x, TRACK_HEIGHT]} stroke="white" strokeWidth={2}/>)}
            {beatPositions.map((x, i) => <Line key={`beat-${i}`} points={[x, 0, x, TRACK_HEIGHT]} stroke="rgba(100,100,100)" strokeWidth={1}/>)}
            {landPositions.map((y, i) => <Line key={`land-${i}`} points={[0, y, musicPx, y]} stroke="rgba(100,100,100)" strokeWidth={1}/>)}

            <Line points={[0, TRACK_HEIGHT, musicPx, TRACK_HEIGHT]} stroke="white" strokeWidth={2}/>

          </Layer>
        </Stage>
  );
}

// rotate類型音樂軌道繪製
const RotateRhythmLineDrawing = () => {

  const { 
    musicPx, //整首歌有幾像素
    howManyBar, //有多少小節(非整除)
    aBarDuration, //一小節幾毫秒
    beatPx,   //每毫秒走幾像素
    howManyBeat, //有多少拍(非整除)
    aBeatDuration, //一拍幾毫秒
  } = UseRhythm();
  
  // console.log('RhythmLineDrawing', musicPx, howManyBar, aBarDuration, beatPx, howManyBeat, aBeatDuration );

  const TRACK_HEIGHT = 50; // 軌道高度

  const barPositions = Array.from({ length: howManyBar + 1 }, (_, i) => (i * aBarDuration) * beatPx);
  const beatPositions = Array.from({ length: howManyBeat }, (_, i) => (i * aBeatDuration) * beatPx);

  return (
    <Stage width={musicPx} height={TRACK_HEIGHT}>
          <Layer>
            {barPositions.map((x, i) => <Line key={`bar-${i}`} points={[x, 0, x, TRACK_HEIGHT]} stroke="white" strokeWidth={2}/>)}
            {beatPositions.map((x, i) => <Line key={`beat-${i}`} points={[x, 0, x, TRACK_HEIGHT]} stroke="rgba(100,100,100)" strokeWidth={1}/>)}
          </Layer>
        </Stage>
  );
}

export const Editor = ({ musicDuration, bpm, beat, signature, aBeatPx }) => (
  <EditorProvider
    musicDuration={musicDuration}
    bpm={bpm}
    beat={beat}
    signature={signature}
    aBeatPx={aBeatPx}
  >
    <TimeRuler />

    <div style={{ position: 'relative' }}>
      <RhythmLineDrawing />
      <div style={{position:'absolute', inset:0 , zIndex:1}} >
        <TimmingMarker />
      </div>
    </div>

    <RotateRhythmLineDrawing />
  </EditorProvider>
);