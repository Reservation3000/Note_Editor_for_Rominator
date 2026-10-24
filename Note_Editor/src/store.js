import { create } from 'zustand';

// Zustand store for music time in milliseconds=======================================
export const musicTimeZ = create((set) => ({
  musicView: 0,
  musicInstance: null,    // 音樂本身
  setMusicView: (value) => set({ musicView: value }),     
  setMusicInstance: (music) => set({ musicInstance: music }), // 音樂本身
}));

  // const musicView = musicTimeZ((state) => state.musicView);      得到音樂時間
  // const setMusicView = musicTimeZ((state) => state.setMusicView);   設定音樂時間
  // const musicInstance = musicTimeZ((state) => state.musicInstance);   得到音樂實例(同時可設定 musicInstance.seek();)
  // const setMusicInstance = musicTimeZ((state) => state.setMusicInstance);  設定音樂實例 (非得到seek時間)


  // 統一設定view跟seek時間的方法 ==============================================
    // seekMusic: (timeMs) => {
    //   const music = get().musicInstance;  // 訂閱自己的音樂物件
    //   if (!music) return;
    //   music.seek(timeMs / 1000);  // 設置Howl的播放位置；將毫秒轉換為秒              
    //   set({ musicView: timeMs }); // 更新音樂時間
    // }
  //===========================================================================