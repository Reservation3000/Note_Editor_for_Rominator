import { useState } from "react";
import { Divider , Select , Slider } from 'antd';
import { DataGet , MusicChose } from './control.jsx'
import { UseInputAndDescribe} from "../hook";
import { CustomerServiceFilled , ContainerFilled } from '@ant-design/icons';



export const InputFiles = ({ setCsvData , setStartLand , setChartOffest }) => {

  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);  //在畫面中顯示檔名
    await DataGet(file, setCsvData, setStartLand, setChartOffest); // 存入資料
  };
  
  return(
    <>
      <label className={`inputCSVFile ${fileName ? "has-file" : ""}`}>
        <input type="file"
               id="csvFile"
               accept=".csv"
               style={{ display: 'none' }}  //不出現原生input檔案按鈕
               onChange={handleFileChange}  //輸入檔案後，對檔案執行處裡
        />

          <ContainerFilled/>
          {fileName || 'no data'}
        </label>
    </>
  );
}

export const InputMusic = ({ setMusicUrl , setStop, setMusicDuration }) => {

  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    MusicChose( e , setStop , setFileName , setMusicUrl, setMusicDuration ); 
  }

  return(
    <>
      <label className={`inputCSVFile ${fileName ? "has-file" : ""}`}>
        <input type="file"
               id="mp3File"
               accept=".mp3,audio/mpeg"
               style={{ display: 'none' }}  
               onChange={handleFileChange}  
        />

          <CustomerServiceFilled/>
          {fileName || 'no data'}
        </label>
    </>
  );
}

export const BaseEditor_Divider = () => {

  return(
     <Divider vertical style={{ height: '80%', borderColor: '#748d51' }}/>
  );
}

export const InputBaseSetting = ({ chartOffest , startLand , beat , bpm , setChartOffest , setStartLand , setBeat , setBpm }) =>{

  return(
    <>
      <UseInputAndDescribe describe="bpm" inputValue={bpm} setValue={setBpm} min={1} max={300}/>
      <UseInputAndDescribe describe="offest(ms)" inputValue={chartOffest} setValue={setChartOffest} min={-10000} max={10000}/>
      <UseInputAndDescribe describe="start land" inputValue={startLand} setValue={setStartLand} min={0} max={31}/>
      <UseInputAndDescribe describe="分音符一拍" inputValue={beat} setValue={setBeat} min={1} max={64}/>
    </>
  );
}

export const InputBaseSetting_noteValue = ({ setSignature }) => {

  const handleChange = (value) => { setSignature(value);  };

  return(
    <>
      <div className="inputeTimeSignature">

        <p style={{ fontSize: '12px' , color:'#ffffff' }}>每小節幾拍</p>

         <Select className="rotateSelect"
                 defaultValue="4"
                 onChange={handleChange}
                 options={[
                  { value: '9', label: '9' },
                  { value: '8', label: '8' },
                  { value: '6', label: '6' },
                  { value: '4', label: '4' },
                  { value: '2', label: '2' },
                  { value: '1', label: '1' },
                 ]}
          />
      </div>
    </>
  );
}

export const NoteSpeedControl = ({setSpeed , speed}) => {

  const handleChange = newValue => {
    setSpeed(newValue);
  };

  return(
    <div className="noteSpeedControl">
      
      <p>speed_{speed}</p>

      <div className="noteSpeedSlider_background">
        <Slider className="noteSpeedSlider"
                min={0.01}
                max={0.1}
                step={0.01}
                onChange={handleChange}
                value={speed}
            />
        </div>
    </div>
  );
}
