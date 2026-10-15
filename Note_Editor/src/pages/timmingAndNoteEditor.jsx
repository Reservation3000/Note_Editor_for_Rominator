import { useState } from 'react';
import { InputNumber, Slider , Radio } from 'antd';
import { PlayCircleFilled , PauseCircleFilled , PlusCircleFilled  , MinusCircleFilled } from '@ant-design/icons';
import { musicTimeZ } from '../store';
import { MusicTimeInput } from './control.jsx';
import { ScrollMarker } from './editorCanvas.jsx';

//撥放按鈕===============================================================
export const PlayButton = ({ setStop, stop }) => {
  const onChange = () => {
    setStop((prev) => !prev);
  };

  return(
    stop ? <PlayCircleFilled className="icon_PlayCircleFilled" onClick={onChange} /> 
          : 
          <PauseCircleFilled className="icon_PlayCircleFilled"onClick={onChange} />
  );
};

// 控制音樂時的滑桿=======================================================
export const TimmingControl =({editorRef, timmingControlValue, musicDuration}) =>{
  const [previewValue, setPreviewValue] = useState(null);
  const value = musicTimeZ((state) => state.musicTime);
  const duration = musicDuration;
  const musicSeek = musicTimeZ((state) => state.musicSeek);
  const sliderValue = previewValue ?? value;

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return(
      <div className='timmingControl_Contanier'>
        <Slider
          className='timmingAndNoteEditor_Top_Slider'
          keyboard
          min={0}
          max={duration}
          styles={{
            track: { backgroundColor: '#aacf75' },
            rail: { backgroundColor: '#4b5748' },
            handle: { backgroundColor: '#fff', borderColor: '#aacf75' },
          }}
          value={sliderValue}
          onChange={(time) => {
            setPreviewValue(time);
            ScrollMarker(editorRef, (time / 1000) * timmingControlValue);
          }}  //拖曳滑桿時持續觸發，讓手把不被音樂播放中的時間更新拉回去
          onChangeComplete={(time) => {  // 放開滑桿時觸發
            musicSeek(time);
            musicTimeZ.getState().setMusicTime(time);
            ScrollMarker(editorRef, (time / 1000) * timmingControlValue);
            setPreviewValue(null);
          }}
          tooltip={{ formatter: time => formatTime((time ?? 0) / 1000) }}
        />
        <p style={{color:'#ffffff'}}>{formatTime((sliderValue ?? 0) / 1000)}</p>
    </div>
  );
}

// 顯示毫秒數
export const TimmingMsShow =() =>{

  const { duration, inputTime, startEditing, seekToInputTime, setInputTime } = MusicTimeInput();

  return(
    <div className='ShowMs'>
      <InputNumber
        classNames={{ root: 'inputNumber', input: 'inputNumber_input' }}
        min={0}
        max={duration}
        step={1}
        precision={0}
        value={inputTime}
        controls={false}
        onFocus={startEditing}
        onChange={setInputTime}
        onPressEnter={seekToInputTime}
        onBlur={seekToInputTime}
      />
      <p className='p2'> Ms </p>
    </div>
  );
}

// 選擇目前編輯的音符種類的按鈕============================================
export const WhiceNoteType =({ noteType , setNoteType }) =>{

   return(
      <Radio.Group className='timmingControl_ChoseNoteTypeButtom' buttonStyle="solid" value={noteType} onChange={e => setNoteType(e.target.value)}>
        <Radio.Button value="note" variant="outlined">note</Radio.Button>
        <Radio.Button value="drag" variant="outlined">drag</Radio.Button>
        <Radio.Button value="rotate" variant="outlined">rotate</Radio.Button>
      </Radio.Group>
   );
  
}

// 縮放軌道上下間距的滑條=================================================
export const LandSpaceControl = ({ timmingControlValue , setTimmingControlValue }) => {

  const onChange = (value) => {
    setTimmingControlValue(value);
  }

  return (
    <div className='landSpaceControl_Contanier'>
      <PlusCircleFilled 
        className="landSpaceControl_plusButtom"
        onClick={() => setTimmingControlValue(prev => Math.min(prev + 5, 150))}
      />
      <MinusCircleFilled 
        className="landSpaceControl_reduceButtom"
        onClick={() => setTimmingControlValue(prev => Math.max(prev - 5, 20))}
      />
      <Slider
        className='landSpaceControl_Slider'
        keyboard
        min={20}
        max={200}
        value={timmingControlValue}
        onChange={onChange}
      />
    </div>
  );
};


