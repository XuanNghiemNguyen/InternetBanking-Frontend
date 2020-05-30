import React from 'react'
import { Form, Input, Button, notification } from 'antd'

const styles = {
  login_Body: {
    backgroundColor: 'white'
  },
  login_form: {
    padding: 30,
    borderStyle: 'outset'
  },
  login_frame: {
    padding: '16vh 30vw'
  },
  title: {
    fontSize: 25,
    marginBottom: 20
  },
  loginForm_footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: 30
  }
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const openNotification = (status, description) => {
      notification.info({
        message: `Đăng nhập ${status}`,
        description,
        placement: 'bottomLeft',
        duration: 1
      })
    }

    const onFinish = (values) => {
      try {
        const { username, password } = values
        console.log(username, password)
        openNotification('thành công', '')
      } catch (error) {
        console.log(error)
        openNotification('thất bại', error.toString())
      }
    }

    const onFinishFailed = (errorInfo) => {
      openNotification('thất bại', errorInfo.toString())
      console.log('Failed:', errorInfo)
    }
    return (
      <div style={styles.login_Body}>
        <div style={styles.login_frame}>
          <Form
            {...layout}
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={styles.login_form}
          >
            <h1 style={styles.title}>Login</h1>
            <Form.Item
              label='Username'
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div style={styles.loginForm_footer}>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        )
      </div>
    )
  }
}
export default LoginPage
