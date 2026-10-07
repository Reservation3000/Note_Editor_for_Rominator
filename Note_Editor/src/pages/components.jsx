import { useState } from 'react';
import {  Drawer } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons';


// 右側設定與個人資料欄位==================================================
export const DrawerStyle =() =>{

  const [drawerOpen, setDrawerOpen] = useState(false);

  const showDrawer = () => { setDrawerOpen(true); };
  const onClose = () => {setDrawerOpen(false);};

  return(
    <div className ="drawerContainer">
      <AlignRightOutlined onClick={showDrawer} />
      <Drawer
        style={{backgroundColor:' #4d534c'}}
        type='blur'
        mask={{ blur: true }}
        size={500}
        title="Editor Of Rominator"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={drawerOpen}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
}