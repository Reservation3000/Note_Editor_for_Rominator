import { createContext, useContext, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { Stage, Layer, Line, Text, Circle, Group, RegularPolygon } from 'react-konva';
import { musicTimeZ } from '../store';
import { useNoteEditor } from './noteEditorState.jsx';
import { createEditorTimeline, directionColor } from './noteEditorModel.js';
import { limitRange } from '../math.js';
import { useRef } from 'react';

const ROTATE_TRACK_HEIGHT = 70;
const EditorViewContext = createContext(null);

const useEditorView = () => {
  const context = useContext(EditorViewContext);
  if (!context) throw new Error('Editor canvas components must be used inside Editor');
  return context;
};

// Keep the playhead visible while the editor's scroll container moves.
export const ScrollMarker = (editorRef, markerX) => {
  const scrollContainer = editorRef.current?.parentElement;
  if (!scrollContainer) return;

  const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  const margin = scrollContainer.clientWidth * 0.5;
  const visibleLeft = scrollContainer.scrollLeft + margin;
  const visibleRight = scrollContainer.scrollLeft + scrollContainer.clientWidth - margin;

  if (markerX > visibleRight) {
    scrollContainer.scrollLeft = Math.min(maxScroll, markerX - scrollContainer.clientWidth + margin);
  } else if (markerX < visibleLeft) {
    scrollContainer.scrollLeft = Math.max(0, markerX - margin);
  }
};

const TimelineGuides = ({ height, showLanes = false }) => {
  const { timeline } = useEditorView();
  const { width, chartOffset, barDurationMs, beatDurationMs, barIndices, beatIndices, laneLines, timeToWidth } = timeline;
  const laneHeight = height / 32;

  return (
    <>
      {showLanes && laneLines.map((y) => (
        <Line
          key={`lane-${y}`}
          points={[0, y, width, y]}
          stroke="rgb(90, 96, 83)"
          strokeWidth={1}
          listening={false}
        />
      ))}
      {showLanes && Array.from({ length: 32 }, (_, laneIndex) => (
        <Text
          key={`lane-label-${laneIndex}`}
          x={4}
          y={(laneIndex + 0.5) * laneHeight - 7}
          width={22}
          text={String(laneIndex)}
          fontSize={11}
          fill="rgb(220, 220, 220)"
          align="center"
          listening={false}
        />
      ))}
      {barIndices.map((index) => {
        const x = timeToWidth(chartOffset + index * barDurationMs);
        return (
          <Line
            key={`bar-${index}`}
            points={[x, 0, x, height]}
            stroke="rgb(220, 220, 220)"
            strokeWidth={2}
            listening={false}
          />
        );
      })}
      {beatIndices.map((index) => {
        const x = timeToWidth(chartOffset + index * beatDurationMs);
        return (
          <Line
            key={`beat-${index}`}
            points={[x, 0, x, height]}
            stroke="rgb(90, 96, 83)"
            strokeWidth={1}
            listening={false}
          />
        );
      })}
    </>
  );
};

const DragEndpoint = ({ note, index, endpoint, x, y }) => {
  const { timeline } = useEditorView();
  const { selectNote, updateNote } = useNoteEditor();
  const isStart = endpoint === 'start';
  const timeField = isStart ? 'timeStart' : 'timeEnd';
  const landField = isStart ? 'landStart' : 'landEnd';

  return (
    <Circle
      x={x}
      y={y}
      radius={5}
      fill="#171d12"
      stroke="#ffffff"
      strokeWidth={3}
      hitStrokeWidth={12}
      draggable
      dragBoundFunc={timeline.laneDragBound}
      onDragStart={() => selectNote(index)}
      onDragEnd={(event) => updateNote(index, {
        [timeField]: timeline.xToTime(event.target.x()),
        [landField]: timeline.yToLand(event.target.y()),
      })}
      aria-label={`${note.type} ${endpoint}`}
    />
  );
};

const DragEvent = ({ note, index, selected }) => {
  const { timeline } = useEditorView();
  const { selectNote } = useNoteEditor();
  const startX = timeline.timeToWidth(note.timeStart);
  const startY = timeline.landToY(note.landStart);
  const endX = timeline.timeToWidth(note.timeEnd);
  const endY = timeline.landToY(note.landEnd);
  const color = directionColor(note.direction);

  return (
    <Group>
      <Line
        points={[startX, startY, endX, endY]}
        stroke={color}
        fill={color}
        strokeWidth={selected ? 6 : 3}
        pointerLength={selected ? 12 : 8}
        pointerWidth={selected ? 15 : 8}
        lineCap="round"
        hitStrokeWidth={14}
        onClick={() => selectNote(index)}
        onTap={() => selectNote(index)}
      />
      {selected && (
        <>
          <DragEndpoint note={note} index={index} endpoint="start" x={startX} y={startY} />
          <DragEndpoint note={note} index={index} endpoint="end" x={endX} y={endY} />
        </>
      )}
    </Group>
  );
};

const ChartEvents = () => {
  const { notes, selectedIndex, selectNote, updateNote } = useNoteEditor();
  const { timeline } = useEditorView();

  return notes.map((note, index) => {
    if (note.type === 'note') {
      const selected = selectedIndex === index;
      return (
        <Circle
          key={`note-${index}`}
          x={timeline.timeToWidth(note.time)}
          y={timeline.landToY(note.land)}
          radius={selected ? 6 : 4}
          fill={selected ? '#d7ff72' : 'rgb(170, 215, 56)'}
          stroke={selected ? '#ffffff' : undefined}
          strokeWidth={selected ? 2 : 0}
          draggable
          dragBoundFunc={timeline.laneDragBound}
          onClick={() => selectNote(index)}
          onTap={() => selectNote(index)}
          onDragStart={() => selectNote(index)}
          onDragEnd={(event) => updateNote(index, {
            time: timeline.xToTime(event.target.x()),
            land: timeline.yToLand(event.target.y()),
          })}
        />
      );
    }

    if (note.type === 'drag') {
      return <DragEvent key={`drag-${index}`} note={note} index={index} selected={selectedIndex === index} />;
    }

    return null;
  });
};

const RotateEvents = () => {
  const { notes, selectedIndex, selectNote, updateNote } = useNoteEditor();
  const { timeline } = useEditorView();

  return notes.map((note, index) => {
    if (note.type !== 'rotate') return null;

    const selected = selectedIndex === index;
    return (
      <Circle
        key={`rotate-${index}`}
        x={timeline.timeToWidth(note.time)}
        y={ROTATE_TRACK_HEIGHT / 2}
        radius={selected ? 7 : 5}
        fill={selected ? '#d7ff72' : directionColor(note.direction)}
        stroke={selected ? '#ffffff' : undefined}
        strokeWidth={selected ? 2 : 0}
        draggable
        dragBoundFunc={timeline.rotateDragBound}
        onClick={() => selectNote(index)}
        onTap={() => selectNote(index)}
        onDragStart={() => selectNote(index)}
        onDragEnd={(event) => updateNote(index, { time: timeline.xToTime(event.target.x()) })}
      />
    );
  });
};

const TimeRuler = () => {
  const { timeline } = useEditorView();
  const setMusicSeek = musicTimeZ((state) => state.setMusicSeek);

  const seekToBar = (index) => {
    const time = limitRange(timeline.durationMs, 0, index * timeline.barDurationMs);
    setMusicSeek(time);
  };

  return (
    <Stage width={timeline.width} height={30}>
      <Layer>
        {timeline.barIndices.map((index) => (
          <Text
            key={`ruler-${index}`}
            x={timeline.timeToWidth(timeline.chartOffset + index * timeline.barDurationMs) + 5}
            y={10}
            text={String(Math.round(timeline.chartOffset + index * timeline.barDurationMs))}
            fontSize={12}
            fill="rgb(220, 220, 220)"
            onClick={() => seekToBar(index)}
            onTap={() => seekToBar(index)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

const Playhead = () => {
  const { timeline, editorRef } = useEditorView();
  const [isDragging, setIsDragging] = useState(false);
  const [previewTime, setPreviewTime] = useState(null);
  const musicSeek = musicTimeZ((state) => state.musicSeek);
  const setMusicSeek = musicTimeZ((state) => state.setMusicSeek);
  const currentTime = previewTime ?? musicSeek;
  const playheadX = timeline.timeToWidth(currentTime);
  const reportPosition = useEffectEvent((position) => ScrollMarker(editorRef, position));

  useEffect(() => {
    if (!isDragging) reportPosition(playheadX);
  }, [isDragging, playheadX]);

  const seekToTime = (time) => {
    const boundedTime = limitRange(timeline.durationMs, 0, time);
    setMusicSeek(boundedTime);
    setPreviewTime(null);
  };

  return (
    <Layer>
      <Group
        x={playheadX}
        draggable
        onDragStart={() => setIsDragging(true)}
        dragBoundFunc={(position) => ({ x: limitRange(timeline.width, 0, position.x), y: 0 })}
        onDragMove={(event) => setPreviewTime(timeline.timeAtX(event.target.x()))}
        onDragEnd={(event) => {
          seekToTime(timeline.timeAtX(event.target.x()));
          setIsDragging(false);
        }}
      >
        <Line points={[0, 10, 0, timeline.height]} stroke="rgb(255, 255, 255)" strokeWidth={2} />
        <RegularPolygon x={0} y={8} sides={3} radius={8} rotation={180} fill="rgb(255, 255, 255)" />
      </Group>
    </Layer>
  );
};

const ChartTrack = () => {
  const { timeline } = useEditorView();
  const { noteType, createNote } = useNoteEditor();

  const handleCanvasClick = (event) => {
    const stage = event.target.getStage();
    if (event.target !== stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    createNote({
      noteType,
      time: timeline.xToTime(pointer.x),
      land: timeline.yToLand(pointer.y),
    });
  };

  return (
    <Stage width={timeline.width} height={timeline.height} onClick={handleCanvasClick}>
      <Layer>
        <TimelineGuides height={timeline.height} showLanes />
        <ChartEvents />
      </Layer>
      <Playhead />
    </Stage>
  );
};

const RotateTrack = () => {
  const { timeline } = useEditorView();

  return (
    <Stage width={timeline.width} height={ROTATE_TRACK_HEIGHT}>
      <Layer>
        <Line
          points={[0, 0, timeline.width, 0]}
          stroke="rgb(220, 220, 220)"
          strokeWidth={1}
          listening={false}
        />
        <TimelineGuides height={ROTATE_TRACK_HEIGHT} />
        <RotateEvents />
      </Layer>
    </Stage>
  );
};

export const Editor = () => {

  const editorRef = useRef(null);
  const { config } = useNoteEditor();
  const timeline = useMemo(() => createEditorTimeline(config), [config]);
  const view = useMemo(() => ({ timeline, editorRef }), [timeline, editorRef]);

  return (
    <EditorViewContext.Provider value={view}>
      <div ref={editorRef}>
        <TimeRuler />
        <ChartTrack />
        <RotateTrack />
      </div>
    </EditorViewContext.Provider>
  );
};
