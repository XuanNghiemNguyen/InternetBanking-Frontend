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
            <b>CÁ NHÂN</b>
          </span>
        }
      >
        
      </SubMenu>
      <SubMenu
        title={
          <span>
            <b>DỊCH VỤ</b>
          </span>
        }
      >
        <MenuItemGroup title='Nạp tiền'>
          <Menu.Item key='setting:1'>
            <Link to={'/deposit'}>Nạp tiền nội bộ</Link>
            </Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title='Tạo tài khoản'>
          <Menu.Item key='setting:2'>
          <Link to={'/createUser'}>Tạo tài khoản</Link>
          </Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title='Lịch sử giao dịch'>
          <Menu.Item key='setting:3'>Nhận tiền</Menu.Item>
          <Menu.Item key='setting:4'>Chuyển khoản</Menu.Item>
          <Menu.Item key='setting:5'>Thanh toán nhắc nợ</Menu.Item>
          <Menu.Item key='setting:6'>Tất cả giao dịch</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
    </Menu>
  )
}
export default LeftMenu
