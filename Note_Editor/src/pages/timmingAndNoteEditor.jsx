import { InputNumber, Slider , Radio } from 'antd';
import { PlayCircleFilled , PauseCircleFilled , PlusCircleFilled  , MinusCircleFilled } from '@ant-design/icons';
import { MusicTimeInput , MusicPlay } from './control.jsx';
import { formatTime } from '../math.js';


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

// 控制音樂時間的滑桿=======================================================
export const TimmingControl = ({ musicDuration, musicUrl, setMusicDuration, stop, setStop }) => {
  
  const { handleSliderChange, handleSliderAfterChange, formattedTime, musicSeek } = MusicPlay(setStop, setMusicDuration, musicUrl, stop);

  return (
    <div className='timmingControl_Contanier'>
      <Slider
        className='timmingAndNoteEditor_Top_Slider'
        keyboard
        min={0}
        max={ musicDuration }
        value={ musicSeek }
        onChange={ handleSliderChange }           // 拖曳中觸發
        onChangeComplete={ handleSliderAfterChange } // 放開滑鼠時觸發 (antd v5+)
        tooltip={{ formatter: () => formatTime(musicSeek) }} // 修正 tooltip 寫法
      >
      </Slider>
      <p style={{ color: '#ffffff' }}>{formattedTime}</p>
    </div>
  );
};

// 顯示毫秒數
export const TimmingMsShow =({ musicDuration }) =>{

  const { inputTime, handleOnFocus, seekToInputTime, setInputTime } = MusicTimeInput(musicDuration);

  return(
    <div className='ShowMs'>
      <InputNumber
        classNames={{ root: 'inputNumber', input: 'inputNumber_input' }}
        min={0}
        max={musicDuration}
        step={1}
        precision={0}
        value={inputTime}
        controls={false}
        onFocus={handleOnFocus}
        onChange={setInputTime}
        onPressEnter={seekToInputTime}  // 按下 Enter 時
        onBlur={seekToInputTime}        // 失去焦點時
      />
      <p className='p2'> Ms </p>
    </div>
  );
}

// 選擇目前編輯的音符種類的按鈕============================================
export const WhiceNoteType =({ noteType , setNoteType }) =>{

  const onChange = (e) => {
    setNoteType(e.target.value);
  }

   return(
      <Radio.Group className='timmingControl_ChoseNoteTypeButtom' 
                   buttonStyle="solid" 
                   value={noteType} 
                   onChange={onChange}>
        <Radio.Button value="note" variant="outlined">note</Radio.Button>
        <Radio.Button value="drag" variant="outlined">drag</Radio.Button>
        <Radio.Button value="rotate" variant="outlined">rotate</Radio.Button>
      </Radio.Group>
   );
  
}

// 縮放軌道上下間距的滑條=================================================
export const LandSpaceControl = ({ setABeatPx , aBeatPx }) => {

  const onChange = (value) => {
    setABeatPx(value);
  }

  const add = () => {
    setABeatPx(prev => Math.min(prev + 5, 50));
  }

  const reduce = () => {
    setABeatPx(prev => Math.max(prev - 5, 10));
  }

  return (
    <div className='landSpaceControl_Contanier'>
      <PlusCircleFilled 
        className="landSpaceControl_plusButtom"
        onClick={add}
      />
      <MinusCircleFilled 
        className="landSpaceControl_reduceButtom"
        onClick={reduce}
      />
      <Slider
        className='landSpaceControl_Slider'
        keyboard
        min={10}
        max={50}
        value={aBeatPx}
        onChange={onChange}
      />
    </div>
  );
};


