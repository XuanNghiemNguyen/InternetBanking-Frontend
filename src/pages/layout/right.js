import React, { useEffect, useState } from "react"
import {
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Typography,
  Drawer,
  Result,
  Divider,
} from "antd"
import { Link, withRouter } from "react-router-dom"
import {
  BellOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SmileOutlined,
  LoginOutlined
} from "@ant-design/icons"
import { REST_API } from "../../config/api"
const { Paragraph } = Typography

let onProcess = false
const RightMenu = (props) => {
  const [visible, setVisible] = useState(false)
  const [notification, setNotification] = useState([])
  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = async () => {
    if (notification.filter((i) => !i.isRead).length !== 0) {
      const data = await REST_API.readNotification()
      if (data && data.result && data.result.length > 0) {
        setNotification(data.result.reverse())
      }
    }
    setVisible(false)
  }
  const currentUser = JSON.parse(localStorage.getItem("user-info"))
  const ws = new WebSocket("ws://localhost:8082")

  useEffect(() => {
    const getNoti = async () => {
      const data = await REST_API.getNotification()
      if (data && data.result && data.result.length > 0) {
        setNotification(data.result.reverse())
      }
    }
    getNoti()
    ws.onopen = () => {
      console.log("connected!")
    }
    ws.onmessage = (event) => {
      if (event.data === "fetch_notification") getNoti()
    }
    ws.onclose = () => {
      ws.close()
    }
    return () => {
      ws.close()
    }
  }, [localStorage.getItem("loggedIn")])
  const handleMenuClick = (e) => {
    switch (+e.key) {
      case 1:
        showDrawer()
        break
      case 2:
        if (!!onProcess) return
        onProcess = true
        props.history.push("/change-password")
        onProcess = false
        break
      case 3:
        if (!!onProcess) return
        onProcess = true
        localStorage.removeItem("access-token")
        localStorage.removeItem("user-info")
        localStorage.setItem("loggedIn", false)
        onProcess = false
        props.history.push("/login")
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}>
      <span>{currentUser && "Xin chào, ".concat(currentUser.name)}</span>
      {localStorage.getItem("access-token") ? (
        <>
          <div key='logout'>
            <Dropdown overlay={menu}>
              <Badge
                count={
                  notification && notification.filter((i) => !i.isRead).length
                }>
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserSwitchOutlined />}
                />
              </Badge>
            </Dropdown>
          </div>
        </>
      ) : (
        <div key='login'>
          <Link type='' className='nav-link' to={"/login"}>
            <LoginOutlined /> Đăng nhập
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
        visible={visible}>
        {notification && notification.length > 0 ? (
          notification.map((item, idx) => (
            <div key={idx}>
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: item.isRead ? "white" : "#f5f5f5"
                }}>
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
