import { useState } from 'react'
import { Drawer } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons';



// 右側設定與個人資料欄位==================================================
export const DrawerStyle =() =>{

  const [drawerOpen, setDrawerOpen] = useState(false);

  const showDrawer = () => { setDrawerOpen(true); };
  const onClose = () => {setDrawerOpen(false);};

  return (
  <div className="drawerContainer">
    <AlignRightOutlined onClick={showDrawer} />
    <Drawer
      style={{ backgroundColor: '#4d534c'}}
      styles={{ header: { color: '#fff' , borderBottom: '1px solid #9cb49389',},
                body: { fontSize: '16px', color: '#fff' }
      }}
      type="blur"
      mask={{ blur: true }}
      size={500}
      title={<span style={{ fontSize: '30px' }}> Editor Of Rominator</span>}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={onClose}
      open={drawerOpen}
    >
      <p>Some contents...</p>
    </Drawer>
  </div>
);
}
