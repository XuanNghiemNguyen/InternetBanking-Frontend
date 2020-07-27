import React from "react"
import { Menu } from "antd"
import { Link, withRouter } from "react-router-dom"

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const LeftMenu = () => {
  return localStorage.getItem("loggedIn") === "false" ? (
    <Menu mode='horizontal'>
      <Menu.Item key='mail'>
        <Link className='nav-link' to={"/home"}>
          <b>TRANG CHỦ</b>
        </Link>
      </Menu.Item>

      <Menu.Item key='aboutus'>
        <Link className='nav-link' to={"/aboutUs"}>
          <b>ABOUT US</b>
        </Link>
      </Menu.Item>
    </Menu>
  ) : localStorage.getItem("loggedIn") === "true" &&
    localStorage.getItem("type") === "employee" ? (
        <Menu mode='horizontal'>
          <Menu.Item key='mail'>
            <Link className='nav-link' to={"/home"}>
              <b>TRANG CHỦ</b>
            </Link>
          </Menu.Item>

          <SubMenu
            title={
              <span>
                <b>DỊCH VỤ</b>
              </span>
            }>
            <MenuItemGroup title='Nạp tiền'>
              <Menu.Item key='setting:1'>
                <Link to={"/deposit"}>Nạp tiền nội bộ</Link>
              </Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title='Tạo tài khoản'>
              <Menu.Item key='setting:2'>
                <Link to={"/createUser"}>Tạo tài khoản</Link>
              </Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title='Lịch sử giao dịch'>
              <Menu.Item key='setting:3'>
                <Link to={"/receiveHistory"}>Nhận Tiền</Link>
              </Menu.Item>
              <Menu.Item key='setting:4'>
                <Link to={"/sendHistory"}>Chuyển khoản</Link>
              </Menu.Item>
              <Menu.Item key='setting:5'>
                <Link to={"/debtHistory"}>Thanh toán nhắc nợ</Link>
              </Menu.Item>
            </MenuItemGroup>
          </SubMenu>
        </Menu>
      ) : localStorage.getItem("type") === "admin" ? (
        <Menu mode='horizontal'>
          <Menu.Item key='main'>
            <Link className='nav-link' to={"/home"}>
              <b>TRANG CHỦ</b>
            </Link>
          </Menu.Item>
          <Menu.Item key='emp'>
            <Link className='nav-link' to={"/employee"}>
              <b>QUẢN LÝ NHÂN VIÊN</b>
            </Link>
          </Menu.Item>
          <Menu.Item key='exc'>
            <Link className='nav-link' to={"/reportTransaction"}>
              <b>QUẢN LÝ GIAO DỊCH</b>
            </Link>
          </Menu.Item>
        </Menu>
      ) : (<Menu mode='horizontal'>
        <Menu.Item key='mail'>
          <Link className='nav-link' to={"/home"}>
            <b>TRANG CHỦ</b>
          </Link>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <b>CÁ NHÂN</b>
            </span>
          }>
          <MenuItemGroup title='Người dùng'>
            <Menu.Item key='u-setting:1'>
              <Link to={"/listAccount"}>Danh sách tài khoản</Link>
            </Menu.Item>
            <Menu.Item key='u-setting:2'>
              <Link to={"/listReceiver"}>Danh sách người nhận</Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu
          title={
            <span>
              <b>GIAO DỊCH</b>
            </span>
          }>
          <MenuItemGroup title='Chuyển khoản'>
            <Menu.Item key='u-setting:3'>
              <Link to={"/interbank-transfer"}>Chuyển khoản nội bộ</Link>
            </Menu.Item>
            <Menu.Item key='u-setting:4'>
              <Link to={"/internal-bank-transfer"}>
                Chuyển khoản liên ngân hàng
        </Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title='Nhắc nợ'>
            <Menu.Item key='u-setting:5'>
              <Link to={"/debtReminder"}>Tạo nhắc nợ</Link>
            </Menu.Item>
            <Menu.Item key='u-setting:6'>
              <Link to={"/debtList"}>Danh sách nhắc nợ</Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title='Lịch sử giao dịch'>
            <Menu.Item key='u-setting:7'>
              <Link to={"/transactionReceive"}>Nhận tiền</Link>
            </Menu.Item>
            <Menu.Item key='u-setting:8'>
              <Link to={"/transactionSend"}>Chuyển khoản</Link>
            </Menu.Item>
            <Menu.Item key='u-setting:9'>
              <Link to={"/transactionDebt"}>Thanh toán nhắc nợ</Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>)
}
export default withRouter(LeftMenu)
