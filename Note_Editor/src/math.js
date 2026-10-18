export const limitRange = (max, min, value) => {
  return Math.floor(Math.min(Math.max(value, min), max));
};

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 1000 / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}