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
        <MenuItemGroup title='Người dùng'>
          <Menu.Item key='setting:1'>
            <Link to={'/listAccount'}>Danh sách tài khoản</Link>
          </Menu.Item>
          <Menu.Item key='setting:2'>Danh sách người nhận</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
      <SubMenu
        title={
          <span>
            <b>GIAO DỊCH</b>
          </span>
        }
      >
        <MenuItemGroup title='Chuyển khoản'>
          <Menu.Item key='setting:3'>Chuyển khoản nội bộ</Menu.Item>
          <Menu.Item key='setting:4'>Chuyển khoản liên ngân hàng</Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title='Nhắc nợ'>
          <Menu.Item key='setting:5'><Link to={'/debtReminder'}>Tạo nhắc nợ</Link></Menu.Item>
          <Menu.Item key='setting:6'>Danh sách nhắc nợ</Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title='Lịch sử giao dịch'>
          <Menu.Item key='setting:7'>Nhận tiền</Menu.Item>
          <Menu.Item key='setting:8'>Chuyển khoản</Menu.Item>
          <Menu.Item key='setting:9'>Thanh toán nhắc nợ</Menu.Item>
          <Menu.Item key='setting:10'>Tất cả giao dịch</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
    </Menu>
  )
}
export default LeftMenu
