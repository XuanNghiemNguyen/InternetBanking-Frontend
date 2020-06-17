import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import ReCAPTCHA from 'react-google-recaptcha'
import { REST_API } from '../../config/api'
import store from '../../redux'
import { openNotification } from '../common/index'

var onProcess = false

const LoginPage = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  useEffect(() => {
    const recentUser = store.getState().currentUser
    if (recentUser) {
      form.setFieldsValue({
        email: recentUser.email,
        password: recentUser.password
      })
    }
  }, [form])

  const onFinish = async (values) => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const { email, password, remember } = values
      const { success, message } = await REST_API.login(email, password, remember)
      if (success) {
        openNotification('Đăng nhập thành công!', '')
        props.history.push(props.match.url)
      } else {
        openNotification('Đăng nhập thất bại!', message)
      }
    } catch (error) {
      console.log(error)
      openNotification('Đăng nhập thất bại!', 'Kiểm tra cài đặt mạng')
    }
    setIsLoading(false)
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
          form={form}
        >
          <h1>
            <b className='title'>Đăng nhập</b>
          </h1>
          <Form.Item
            name='email'
            rules={[{ required: true, message: 'Hãy nhập Email!' }]}
          >
            <Input
              autoComplete='on'
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
          >
            <Input.Password
              autoComplete='on'
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu'
            />
          </Form.Item>
          <Form.Item
            name='captcha'
            rules={[{ required: true, message: 'Bạn phải xác thực reCatcha!' }]}
          >
            <ReCAPTCHA sitekey='6LfAXP4UAAAAAISw6aIjaLk8MupZs0yOkYbUPfR9' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={isLoading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <div className='loginForm_footer'>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Lưu thông tin</Checkbox>
            </Form.Item>
            <Button type='link' onClick={() => {
              localStorage.setItem('codeSent', false)
              props.history.push({
                pathname: 'getOTPCode',
                dict: 'forgot-password'
              })
            }}>Quên mật khẩu?</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
export default LoginPage
