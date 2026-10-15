const NOTE_RUNTIME_DATA = {
  startPosition: 10,
  endPosition: 4,
  lifePosition: 3.5,
  notePosition: 5,
};

export const clampNumber = (value, min, max) => {
  const number = Number(value);
  const finiteValue = Number.isFinite(number) ? number : min;
  return Math.max(min, Math.min(max, finiteValue));
};

export const clampInteger = (value, min, max) => Math.round(clampNumber(value, min, max));

export const getNoteTime = (note) => (note.type === 'drag' ? note.timeStart : note.time);

export const directionColor = (direction) => {
  if (direction === 1) return 'rgb(255, 104, 104)';
  if (direction === 0) return 'rgb(107, 189, 255)';
  return 'rgb(150, 150, 150)';
};

const getBeatDuration = ({ bpm, beat }) => {
  const safeBpm = Number(bpm);
  const safeBeat = Number(beat);
  return safeBpm > 0 && safeBeat > 0 ? (60_000 / safeBpm) * (4 / safeBeat) : 1;
};

export const snapTime = (time, config) => {
  const durationMs = Math.max(0, Number(config.musicDuration) || 0);
  const offsetMs = Number(config.chartOffset) || 0;
  const beatDurationMs = getBeatDuration(config);
  const snappedTime = offsetMs + Math.round((Number(time) - offsetMs) / beatDurationMs) * beatDurationMs;
  return Math.round(clampNumber(snappedTime, 0, durationMs));
};

export const createNoteData = (noteType, time, land, config) => {
  const durationMs = Math.max(0, Number(config.musicDuration) || 0);
  const beatDurationMs = getBeatDuration(config);
  const snappedTime = snapTime(time, config);
  const safeLand = clampInteger(land, 1, 31);

  if (noteType === 'drag') {
    const timeStart = Math.round(Math.min(snappedTime, Math.max(0, durationMs - beatDurationMs)));
    return {
      ...NOTE_RUNTIME_DATA,
      type: 'drag',
      timeStart,
      timeEnd: Math.round(timeStart + beatDurationMs),
      landStart: safeLand,
      landEnd: safeLand,
      direction: 0,
      segment: Array.from({ length: 11 }, () => ({ isActive: false })),
    };
  }

  if (noteType === 'rotate') {
    return {
      ...NOTE_RUNTIME_DATA,
      type: 'rotate',
      time: snappedTime,
      direction: 0,
      isActive: false,
    };
  }

  return {
    ...NOTE_RUNTIME_DATA,
    type: 'note',
    time: snappedTime,
    land: safeLand,
    isActive: false,
  };
};

export const getNoteFormValues = (note) => {
  if (!note) return {};

  return {
    time: note.time === undefined ? undefined : Math.round(note.time),
    land: note.land === undefined ? undefined : Math.round(note.land),
    startTime: note.timeStart === undefined ? undefined : Math.round(note.timeStart),
    endTime: note.timeEnd === undefined ? undefined : Math.round(note.timeEnd),
    startLand: note.landStart === undefined ? undefined : Math.round(note.landStart),
    endLand: note.landEnd === undefined ? undefined : Math.round(note.landEnd),
    direction: note.direction === undefined ? undefined : Math.round(note.direction),
  };
};

export const createNoteUpdates = (note, values) => {
  const getNumber = (field, fallback) => {
    const value = Number(values[field] ?? fallback);
    return Number.isFinite(value) ? Math.round(value) : fallback;
  };

  if (note.type === 'drag') {
    return {
      timeStart: getNumber('startTime', note.timeStart),
      timeEnd: getNumber('endTime', note.timeEnd),
      landStart: getNumber('startLand', note.landStart),
      landEnd: getNumber('endLand', note.landEnd),
      direction: getNumber('direction', note.direction ?? 0),
    };
  }

  if (note.type === 'rotate') {
    return {
      time: getNumber('time', note.time),
      direction: getNumber('direction', note.direction ?? 0),
    };
  }

  return {
    time: getNumber('time', note.time),
    land: getNumber('land', note.land),
  };
};

export const createEditorTimeline = (config) => {
  const durationMs = Math.max(0, Number(config.musicDuration) || 0);
  const pixelsPerSecond = Math.max(0, Number(config.pixelsPerSecond) || 0);
  const chartOffset = Number(config.chartOffset) || 0;
  const bpm = Number(config.bpm) || 120;
  const beat = Number(config.beat) || 4;
  const signature = Number(config.signature) || 4;
  const beatDurationMs = getBeatDuration({ bpm, beat });
  const barDurationMs = beatDurationMs * signature;
  const width = (durationMs / 1000) * pixelsPerSecond;
  const height = 550;
  const laneHeight = height / 31;

  const timeToWidth = (time) => (Number(time) / 1000) * pixelsPerSecond;
  const timeAtX = (x) => (width > 0 ? (clampNumber(x, 0, width) / width) * durationMs : 0);
  const xToTime = (x) => snapTime(timeAtX(x), { musicDuration: durationMs, chartOffset, bpm, beat });
  const landToY = (land) => (clampInteger(land, 1, 31) - 0.5) * laneHeight;
  const yToLand = (y) => clampInteger(Math.round(Number(y) / laneHeight + 0.5), 1, 31);
  const laneDragBound = (position) => ({
    x: clampNumber(position.x, 0, width),
    y: landToY(yToLand(position.y)),
  });
  const rotateDragBound = (position) => ({
    x: timeToWidth(xToTime(clampNumber(position.x, 0, width))),
    y: 35,
  });

  const firstBarIndex = durationMs > 0 ? Math.max(0, Math.ceil(-chartOffset / barDurationMs)) : 0;
  const lastBarIndex = durationMs > 0 ? Math.floor((durationMs - chartOffset) / barDurationMs) : -1;
  const firstBeatIndex = durationMs > 0 ? Math.max(0, Math.ceil(-chartOffset / beatDurationMs)) : 0;
  const lastBeatIndex = durationMs > 0 ? Math.floor((durationMs - chartOffset) / beatDurationMs) : -1;

  return {
    width,
    height,
    durationMs,
    chartOffset,
    barDurationMs,
    beatDurationMs,
    laneHeight,
    timeToWidth,
    timeAtX,
    xToTime,
    landToY,
    yToLand,
    laneDragBound,
    rotateDragBound,
    barIndices: Array.from({ length: Math.max(0, lastBarIndex - firstBarIndex + 1) }, (_, index) => firstBarIndex + index),
    beatIndices: Array.from({ length: Math.max(0, lastBeatIndex - firstBeatIndex + 1) }, (_, index) => firstBeatIndex + index),
    laneLines: Array.from({ length: 32 }, (_, index) => index * laneHeight),
  };
};

// Compatibility helpers for the previous canvas utilities.
export const widthToTime = (x, allWidth, musicDuration, chartOffset, beatDuration) => {
  const rawTime = allWidth > 0 ? (x / allWidth) * musicDuration : 0;
  const snappedTime = chartOffset + Math.round((rawTime - chartOffset) / beatDuration) * beatDuration;
  return Math.round(Math.max(0, snappedTime));
};

export const limitDragBound = (position, allWidth, laneHeight) => ({
  x: clampNumber(position.x, 0, allWidth),
  y: (clampInteger(Math.round(position.y / laneHeight + 0.5), 1, 31) - 0.5) * laneHeight,
});
