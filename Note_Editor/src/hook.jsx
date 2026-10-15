import { InputNumber } from 'antd';
import './hook.css'


export const UseInputAndDescribe = ({ describe , inputValue , setValue , min , max, precision }) => {

  const onChange = (val) => setValue(val);

  return (
    <div className="useInputAndDescribestyle_container">
      <InputNumber classNames={{ root: 'inputNumber', input: 'inputNumber_input', }}
                   min={min || 0} 
                   max={max || 1000000} 
                   defaultValue={0} 
                   value={inputValue}  
                   onChange={onChange}
                   precision={precision}
                   step={precision === 0 ? 1 : undefined}
                   controls={false}
      />
      <p style={{ fontSize: '12px' , color:'#ffffff'}}>{describe}</p>
    </div>
  );
};

