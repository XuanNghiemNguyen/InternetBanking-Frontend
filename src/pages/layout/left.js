import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu


const LeftMenu = () => {
  return (
    <Menu mode='horizontal'>
      <Menu.Item key='mail'>
        <Link className='nav-link' to={'/home'}>
          <b>TRANG CHỦ</b>
        </Link>
      </Menu.Item>
      <SubMenu
        title={
          <span>
            <b>CÁ NHÂN</b>
          </span>
        }
      >
      
      </SubMenu>
      <SubMenu
        title={
          <span>
            <b>ABOUT US</b>
          </span>
        }
      >
        
      </SubMenu>
    </Menu>
  )
}
export default LeftMenu
