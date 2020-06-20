import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

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
            <b>ABOUT US</b>
          </span>
        }
      >
      </SubMenu>
      <SubMenu
        title={
          <span>
            <b>LIÊN HỆ</b>
          </span>
        }
      >
    
      </SubMenu>
    </Menu>
  )
}
export default LeftMenu
