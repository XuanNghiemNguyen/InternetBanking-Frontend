import React, { Component } from 'react'
import { Menu, Input, Avatar, Dropdown } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
const { Search } = Input
const { Item } = Menu

let onProcess = false
class RightMenu extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const currentUser = JSON.parse(localStorage.getItem('user-info'))
    const handleMenuClick = (e) => {
      switch (+e.key) {
        case 1:
          break
        case 2:
          if (!!onProcess) return
          onProcess = true
          localStorage.removeItem('access-token')
          localStorage.removeItem('user-info')
          onProcess = false
          this.props.history.push('/login')
          break
        default:
          break
      }
    }
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='1' icon={<UserOutlined />}>
          Quản lý tài khoản
        </Menu.Item>
        <Menu.Item key='2' icon={<UserOutlined />}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    )
    return (
      <Menu mode='horizontal'>
        <Search
          placeholder='Tìm kiếm...'
          onSearch={(value) => console.log(value)}
          style={{ width: 0.3 * window.innerWidth, marginRight: 10 }}
        />
        <span>{(currentUser && 'Xin chào, '.concat(currentUser.name))}</span>
        {localStorage.getItem('access-token') ? (
          <Item key='logout'>
            <Dropdown overlay={menu}>
              <Avatar
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Item>
        ) : (
          <Item key='login'>
            <Link className='nav-link' to={'/login'}>
              Đăng nhập
            </Link>
          </Item>
        )}
      </Menu>
    )
  }
}
export default withRouter(RightMenu)
