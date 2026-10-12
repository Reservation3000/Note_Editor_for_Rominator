import { InputNumber } from 'antd';
import './hook.css'


export const UseInputAndDescribe = ({ describe , inputValue , setValue }) => {

  const onChange = (val) => setValue(val);

  return (
    <div className="useInputAndDescribestyle_container">
      <InputNumber classNames={{ root: 'inputNumber', input: 'inputNumber_input', }}
                   min={0} 
                   max={10000000} 
                   defaultValue={0} 
                   value={inputValue}  
                   onChange={onChange}
                   controls={false}
      />
      <p style={{ fontSize: '12px' , color:'#ffffff'}}>{describe}</p>
    </div>
  );
};

