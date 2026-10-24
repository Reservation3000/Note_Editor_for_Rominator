import { useEffect, useMemo, useRef } from 'react';
import { Howl } from 'howler';
import hitSoundUrl from '../assets/hit.wav';
import { musicTimeZ } from '../store';
import { formatTime } from '../math.js';

const diameter = 320;
const radius = diameter / 2;
const OUTER_RADIUS = 200;
const INNER_RADIUS = 60;
const GAME_START_POSITION = 4.9;
const GAME_END_POSITION = 1.25;
const LAND_COUNT = 32;
const ARC_ANGLE = (Math.PI * 2 / LAND_COUNT) * 2;

const getPreviewEvents = (csvData) => csvData.flatMap((note, noteIndex) => {
  if (note.type === 'drag') {
    let landDelta = note.landEnd - note.landStart;
    if (note.direction === 1 && landDelta < 0) landDelta += LAND_COUNT;
    if (note.direction === 0 && landDelta > 0) landDelta -= LAND_COUNT;

    return Array.from({ length: 11 }, (_, segmentIndex) => {
      const progress = segmentIndex / 10;
      return {
        key: `drag-${noteIndex}-${segmentIndex}`,
        type: 'drag',
        triggerTime: note.timeStart + (note.timeEnd - note.timeStart) * progress,
        land: note.landStart + landDelta * progress,
        direction: note.direction,
      };
    });
  }

  return [{
    key: `${note.type}-${noteIndex}`,
    type: note.type,
    triggerTime: note.time,
    land: note.land,
    direction: note.direction,
  }];
});

export const CirclePreview = ({ csvData, speed }) => {
  const musicView = musicTimeZ((state) => state.musicView);
  const pixelsPerFrame = Math.max(Number(speed) || 0.06, 0.001);
  const travelDuration = ((GAME_START_POSITION - GAME_END_POSITION) / pixelsPerFrame) * (1000 / 60);
  const previewEvents = useMemo(() => getPreviewEvents(csvData), [csvData]);
  const hitSoundRef = useRef(null);
  const previousMusicTimeRef = useRef(musicView);

  useEffect(() => {
    const hitSound = new Howl({ src: [hitSoundUrl], volume: 0.35, preload: true });
    hitSoundRef.current = hitSound;

    return () => {
      hitSound.unload();
      hitSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const previousTime = previousMusicTimeRef.current;
    previousMusicTimeRef.current = musicView;
    if (musicView <= previousTime || !hitSoundRef.current) return;

    previewEvents.forEach((event) => {
      if (event.triggerTime > previousTime && event.triggerTime <= musicView) {
        hitSoundRef.current.play();
      }
    });
  }, [musicView, previewEvents]);

  return (
    <div className="circlePreviewContent">
      <header className="circlePreviewHeader">
        <h3>GAME PREVIEW</h3>
        <span>{formatTime(musicView)}</span>
      </header>

      <svg
        className="circlePreviewArena"
        viewBox={`0 0 ${diameter} ${diameter}`}
        role="img"
        aria-label="Music-synchronized circular gameplay preview"
      >
        <circle cx={radius} cy={radius} r={OUTER_RADIUS + 5} fill="#0b100c" stroke="#45553e" strokeWidth="1.5" />
        <circle cx={radius} cy={radius} r={INNER_RADIUS} fill="#0b100c" stroke="#bada55" strokeWidth="2" />
        <circle cx={radius} cy={radius} r={INNER_RADIUS + 7} className="circlePreviewHitRing" />

        {Array.from({ length: LAND_COUNT }, (_, landIndex) => {
          const angle = -(landIndex / LAND_COUNT) * Math.PI * 2;
          const isMajor = landIndex % 4 === 0;
          return (
            <line
              key={`lane-${landIndex}`}
              className={`circlePreviewLane${isMajor ? ' circlePreviewMajorLane' : ''}`}
              x1={radius + Math.cos(angle) * (INNER_RADIUS + 8)}
              y1={radius + Math.sin(angle) * (INNER_RADIUS + 8)}
              x2={radius + Math.cos(angle) * OUTER_RADIUS}
              y2={radius + Math.sin(angle) * OUTER_RADIUS}
            />
          );
        })}

        {Array.from({ length: LAND_COUNT }, (_, landIndex) => {
          const angle = -(landIndex / LAND_COUNT) * Math.PI * 2;
          const labelRadius = 174;
          return (
            <text
              key={`lane-number-${landIndex}`}
              className="circlePreviewLaneNumber"
              x={radius + Math.cos(angle) * labelRadius}
              y={radius + Math.sin(angle) * labelRadius}
            >
              {landIndex}
            </text>
          );
        })}

        {previewEvents.map((event) => {
          const elapsed = musicView - (event.triggerTime - travelDuration);
          if (elapsed < 0 || elapsed >= travelDuration) return null;

          const progress = elapsed / travelDuration;
          const noteRadius = OUTER_RADIUS - progress * (OUTER_RADIUS - INNER_RADIUS - 8);
          const landPosition = ((event.land ?? 0) % LAND_COUNT + LAND_COUNT) % LAND_COUNT;
          const angle = -(landPosition / LAND_COUNT) * 360;
          const color = event.type === 'note' || event.type === 'drag'
            ? '#ffffff'
            : event.direction === 1 ? '#75b3ff' : '#ff6868';

          if (event.type === 'rotate') {
            return (
              <circle
                key={event.key}
                cx={radius}
                cy={radius}
                r={noteRadius}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                opacity="0.9"
              />
            );
          }

          const circumference = Math.PI * 2 * noteRadius;
          const arcLength = noteRadius * ARC_ANGLE;
          return (
            <circle
              key={event.key}
              cx={radius}
              cy={radius}
              r={noteRadius}
              fill="none"
              stroke={color}
              strokeWidth= '1.5'
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference - arcLength}`}
              transform={`rotate(${angle} ${radius} ${radius})`}
              opacity="0.95"
            />
          );
        })}

        <text x={radius} y={radius} className="circlePreviewTime">{Math.floor(musicView)}</text>
      </svg>
    </div>
  );
};



