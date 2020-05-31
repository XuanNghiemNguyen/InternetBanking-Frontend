import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import { Form, Input, Button, notification, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import ReCAPTCHA from 'react-google-recaptcha'

const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const MY_KEY = '6LcaXv4UAAAAAAfBvC3Om1XKGBhwkZAlcK2dwUwO'
class LoginPage extends React.Component {
  render() {
    const onCaptchaChange = (value) => {
      console.log('Captcha value:', value)
    }
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
            <Form.Item
              name='username'
              rules={[
                { required: true, message: 'Please input your Username!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Username'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your Password!' }
              ]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <div className='loginForm_footer'>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to={'/forgot-password'}>Forgot Password</Link>
            </div>
            <Form.Item>
              <Form.Item name='captcha'>
                <ReCAPTCHA sitekey={TEST_KEY} onChange={onCaptchaChange} />
              </Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
        )
      </div>
    )
  }
}
export default LoginPage
