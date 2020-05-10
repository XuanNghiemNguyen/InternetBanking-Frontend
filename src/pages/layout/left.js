import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class LeftMenu extends Component {
  render() {
    return (
      <Menu mode='horizontal'>
        <Menu.Item key='mail'>
          <Link className='nav-link' to={'/home'}>
            <b>TRANG CHỦ</b>
          </Link>
        </Menu.Item>
        <SubMenu title={<span><b>NGHIỆP VỤ</b></span>}>
          <MenuItemGroup title='Item 1'>
            <Menu.Item key='setting:1'>Option 1</Menu.Item>
            <Menu.Item key='setting:2'>Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title='Item 2'>
            <Menu.Item key='setting:3'>Option 3</Menu.Item>
            <Menu.Item key='setting:4'>Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key='alipay'>
          <Link className='nav-link' to={'/login'}>
            <b>LIÊN HỆ</b>
          </Link>
        </Menu.Item>
      </Menu>
    )
  }
}
export default LeftMenu
