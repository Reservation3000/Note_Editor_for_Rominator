import { useState } from 'react';
import { Slider , Radio } from 'antd';
import { PlayCircleFilled , PlusCircleFilled  , MinusCircleFilled } from '@ant-design/icons';


//撥放按鈕===============================================================
export const PlayButtom =() =>{
  return(
    <PlayCircleFilled className="icon_PlayCircleFilled"/>
  );
}

// 控制音樂時的滑桿=======================================================
export const TimmingControl =({ duration = 100 }) =>{

  const [value, setValue] = useState(0);
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
          value={value}
          onChange={setValue}
          tooltip={{ formatter: value => formatTime(value ?? 0) }}
        />
        <p style={{color:'#ffffff'}}>{formatTime(value ?? 0)}</p>
    </div>
  );
}

// 選擇目前編輯的音符種類的按鈕============================================
export const WhiceNoteType =({ noteType , setNoteType }) =>{

   return(
      <Radio.Group className='timmingControl_ChoseNoteTypeButtom' buttonStyle="solid" value={noteType} onChange={e => setNoteType(e.target.value)}>
        <Radio.Button value="note" variant="outlined">note</Radio.Button>
        <Radio.Button value="darg" variant="outlined">darg</Radio.Button>
        <Radio.Button value="rotate" variant="outlined">rotate</Radio.Button>
      </Radio.Group>
   );
  
}

// 縮放軌道上下間距的滑條=================================================
export const LandSpaceControl = ({ duration = 100 }) => {
  const [value, setValue] = useState(30);

  return (
    <div className='landSpaceControl_Contanier'>
      <PlusCircleFilled className="landSpaceControl_plusButtom"/>
      <MinusCircleFilled className="landSpaceControl_reduceButtom"/>
      <Slider
        className='landSpaceControl_Slider'
        keyboard
        min={0}
        max={duration}
        styles={{
          track: { backgroundColor: '#aacf75' },
          rail: { backgroundColor: '#4b5748' },
          handle: { backgroundColor: '#fff', borderColor: '#aacf75' },
        }}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};