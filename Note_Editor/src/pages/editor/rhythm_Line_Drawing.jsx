
import { Stage, Layer, Line, Text } from 'react-konva';
import { EditorProvider, UseRhythm } from './editorContext.jsx';


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
  <EditorProvider musicDuration={musicDuration}
                  bpm={bpm}
                  beat={beat}
                  signature={signature}
                  aBeatPx={aBeatPx}
  >
    <TimeRuler />
    <RhythmLineDrawing />
    <RotateRhythmLineDrawing/>
  </EditorProvider>
);