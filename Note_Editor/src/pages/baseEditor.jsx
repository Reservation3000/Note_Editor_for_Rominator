import { useState , useEffect } from "react";
import { Divider , Select , Slider } from 'antd';
import { dataProcessing } from './control'
import { UseInputAndDescribe} from "../hook";
import { CustomerServiceFilled , ContainerFilled } from '@ant-design/icons';



export const InputFiles = ({ setCsvData , setStartLand , setChartOffest }) => {

  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);  //在畫面中顯示檔名
    
    try {
      const textData = await file.text();  // 取得檔案的純文字內容（適用於 CSV, TXT, JSON 等）
      
      const { processedChart, startLand, chartOffset } = dataProcessing(textData); // 處理csv資料，並解構取得三個變數

      console.log(dataProcessing(textData));

      // 把三個變數資料存進state
      setCsvData(processedChart);                                     // 譜面
      setStartLand(Number.isFinite(startLand) ? startLand : 0);       // 第一條軌道
      setChartOffest(Number.isFinite(chartOffset) ? chartOffset : 0); // 偏移

    } catch (error) {
      console.error('get file error:', error);
    }
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

export const InputMusic = ({ setCsvData , setStartLand , setChartOffest }) => {

  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);  //在畫面中顯示檔名
    const url = URL.createObjectURL(file); //記憶體中存入一個臨時的本地音樂網址
    
  }

  return(
    <>
      <label className={`inputCSVFile ${fileName ? "has-file" : ""}`}>
        <input type="file"
               id="mp3File"
               accept=".mp3"
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

export const InputBaseSetting = ({ chartOffest , startLand , beat , setChartOffest , setStartLand , setBeat }) =>{

  return(
    <>
      <UseInputAndDescribe describe="bpm"/>
      <UseInputAndDescribe describe="offest(ms)" inputValue={chartOffest} setValue={setChartOffest}/>
      <UseInputAndDescribe describe="start land" inputValue={startLand} setValue={setStartLand} />
      <UseInputAndDescribe describe="beat" inputValue={beat} setValue={setBeat}/>
    </>
  );
}

export const InputBaseSetting_noteValue = () => {

  const[noteValue , setNoteValue]=useState();

  const handleChange = (value) => {
        setNoteValue(value);
    };

  return(
    <>
      <div className="inputeTimeSignature">

        <p style={{ fontSize: '12px' , color:'#ffffff' }}>time_signature</p>

         <Select className="rotateSelect"
                 defaultValue="4/4"
                 onChange={handleChange}
                 options={[
                  { value: '4/4', label: '4/4' },
                  { value: '3/4', label: '3/4' },
                  { value: '2/4', label: '2/4' },
                  { value: '6/8', label: '6/8' },
                  { value: '5/4', label: '5/4' },
                  { value: '7/8', label: '7/8' },
                 ]}
          />
      </div>
    </>
  );
}

export const NoteSpeedControl = ({setSpeed , speed}) => {

  const onChange = newValue => {
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
                onChange={onChange}
                value={speed}
            />
        </div>
    </div>
  );
}
