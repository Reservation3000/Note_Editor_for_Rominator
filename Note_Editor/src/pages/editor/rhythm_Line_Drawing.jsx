
import { Stage, Layer, Line } from 'react-konva';
import { EditorProvider, UseRhythm } from './editorContext.jsx';
import { useMemo } from 'react';


// 時間尺
const TimeRuler = ({ musicDuration, bpm, beat, signature, aBeatPx }) => {

  const { 
    musicPx, //整首歌有幾像素
    howManyBar, //有多少小節(非整除)
    aBarDuration, //一小節幾毫秒
    beatPx,   //每毫秒走幾像素
    howManyBeat, //有多少拍(非整除)
    aBeatDuration, //一拍幾毫秒
  } = UseRhythm();
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

  const ROTATE_TRACK_HEIGHT = 590; // 軌道高度
  const laneHeight = ROTATE_TRACK_HEIGHT / 32; //每個軌道長度

  const barPositions = Array.from({ length: howManyBar + 1 }, (_, i) => (i * aBarDuration) * beatPx);
  const beatPositions = Array.from({ length: howManyBeat }, (_, i) => (i * aBeatDuration) * beatPx);
  const landPositions = Array.from({ length: 31 + 1 }, (_, i) => i *laneHeight);

  return (
    <Stage width={musicPx} height={ROTATE_TRACK_HEIGHT}>
          <Layer>
            {barPositions.map((x, i) => <Line key={`bar-${i}`} points={[x, 0, x, ROTATE_TRACK_HEIGHT]} stroke="white" strokeWidth={2}/>)}
            {beatPositions.map((x, i) => <Line key={`beat-${i}`} points={[x, 0, x, ROTATE_TRACK_HEIGHT]} stroke="rgba(100,100,100)" strokeWidth={1}/>)}
            {landPositions.map((y, i) => <Line key={`land-${i}`} points={[0, y, musicPx, y]} stroke="rgba(100,100,100)" strokeWidth={1}/>)}

            <Line points={[0, ROTATE_TRACK_HEIGHT, musicPx, ROTATE_TRACK_HEIGHT]} stroke="white" strokeWidth={1}/>

          </Layer>
        </Stage>
  )
}

export const Editor = ({ musicDuration, bpm, beat, signature, aBeatPx }) => (
  <EditorProvider
    musicDuration={musicDuration}
    bpm={bpm}
    beat={beat}
    signature={signature}
    aBeatPx={aBeatPx}
  >
    <TimeRuler/>
    <RhythmLineDrawing
      musicDuration={musicDuration}
      bpm={bpm}
      beat={beat}
      signature={signature}
      aBeatPx={aBeatPx}
    />
  </EditorProvider>
);