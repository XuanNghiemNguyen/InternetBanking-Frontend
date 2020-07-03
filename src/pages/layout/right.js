import React, { useEffect, useState } from 'react'
import { Menu, Avatar, Dropdown, Badge, Typography, Drawer, Result, Divider } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import {
  BellOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { REST_API } from '../../config/api'
const { Paragraph } = Typography

let onProcess = false
const RightMenu = (props) => {
  const [visible, setVisible] = useState(false)
  const [notification, setNotification] = useState([])
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  useEffect(() => {
    const getNoti = async () => {
      const data = await REST_API.getNotification()
      if (data) {
        setNotification(data.result)
        console.log(data)
      }
    }
    getNoti()
  }, [])
  const currentUser = JSON.parse(localStorage.getItem('user-info'))
  const handleMenuClick = (e) => {
    switch (+e.key) {
      case 1:
        showDrawer()
        break
      case 2:
        if (!!onProcess) return
        onProcess = true
        props.history.push('/change-password')
        onProcess = false
        break
      case 3:
        if (!!onProcess) return
        onProcess = true
        localStorage.removeItem('access-token')
        localStorage.removeItem('user-info')
        localStorage.setItem('loggedIn', false)
        onProcess = false
        props.history.push('/login')
        break
      default:
        break
    }
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='1' icon={<BellOutlined />}>
        Thông báo
      </Menu.Item>
      <Menu.Item key='2' icon={<UserSwitchOutlined />}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key='3' icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      <span>{currentUser && 'Xin chào, '.concat(currentUser.name)}</span>
      {localStorage.getItem('access-token') ? (
        <>
          <div key='logout'>
            <Dropdown overlay={menu}>
              <Badge count={notification && notification.length}>
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={<UserSwitchOutlined />}
                />
              </Badge>
            </Dropdown>
          </div>
        </>
      ) : (
        <div key='login'>
          <Link className='nav-link' to={'/login'}>
            Đăng nhập
          </Link>
        </div>
      )}
      <Drawer
        title={
          <h3>
            <b>Thông báo</b>
          </h3>
        }
        width={window.innerWidth / 3}
        placement='right'
        closable={true}
        onClose={onClose}
        visible={visible}
      >
        {notification && notification.length > 0 ? (
          notification.map((item, idx) => (
            <div key={idx}>
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                style={{ backgroundColor: item.isRead ? '#ccc' : 'white' }}
              >
                {item.content}
              </Paragraph>
              <Divider plain></Divider>
            </div>
          ))
        ) : (
          <Result icon={<SmileOutlined />} title='Không có thông báo nào!' />
        )}
      </Drawer>
    </div>
  )
}
export default withRouter(RightMenu)
