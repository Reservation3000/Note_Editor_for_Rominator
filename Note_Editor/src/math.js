// 限制範圍
export const limitRange = (max, min, value) => {
  return Math.floor(Math.min(Math.max(value, min), max));
};

// 毫秒轉 00:00 格式
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 1000 / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// 時間轉px
export const timeToWidth = (time, musicDuration, musicPx) => (time / musicDuration) * musicPx;

// px轉時間
export const widthToTime = (musicPx, time) => {
  return (x) => {
    if (musicPx <= 0) return 0;

    const calculatedX = limitRange(musicPx, 0, x);
    return (calculatedX / musicPx) * time;
  };
};