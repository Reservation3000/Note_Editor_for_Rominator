import { useState } from 'react';
import { Slider } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';


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