import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import { Form, Input, Button, notification, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { API } from '../../config/api'

const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const MY_KEY = '6LcaXv4UAAAAAAfBvC3Om1XKGBhwkZAlcK2dwUwO'
var onProcess = false
class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }
  render() {
    const onCaptchaChange = (value) => {
      console.log('Captcha value:', value)
    }
    const openNotification = (message, description) => {
      notification.info({
        message,
        description,
        placement: 'bottomLeft',
        duration: 1
      })
    }

    const onFinish = async (values) => {
      try {
        if (!!onProcess) return
        onProcess = true
        this.setState({ isLoading: true })
        const { email, password } = values
        const { message, success } = await API.login(email, password)
        if (success) {
          openNotification('Đăng nhập thành công!', '')
          this.props.history.push('/home')
        } else {
          openNotification('Đăng nhập thất bại!', message)
        }
      } catch (error) {
        console.log(error)
        openNotification('Đăng nhập thất bại!', 'Kiểm tra cài đặt mạng')
      }
      this.setState({ isLoading: false })
      onProcess = false
    }

    const onFinishFailed = (errorInfo) => {
      console.log(errorInfo)
    }

    return (
      <div>
        <div className='login_frame'>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className='login_form'
          >
            <h1>
              <b className='title'>Login</b>
            </h1>
            <Form.Item name='email' rules={[{ type: 'email' }]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Email'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your Password!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item name='captcha'>
              <ReCAPTCHA sitekey={MY_KEY} onChange={onCaptchaChange} />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
                loading={this.state.isLoading}
              >
                Log in
              </Button>
            </Form.Item>
            <div className='loginForm_footer'>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to={'/forgot-password'}>Forgot Password</Link>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default LoginPage
