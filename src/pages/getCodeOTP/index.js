import React, { useState } from 'react'
import './index.css'
import { Form, Input, Button, notification, Typography } from 'antd'

import { UserOutlined } from '@ant-design/icons'
import { REST_API } from '../../config/api'

const { Text } = Typography
var onProcess = false

const GetCodeOTP = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const { email } = values
      const data = await REST_API.getCode(email)
      if (data.success) {
        openNotification('Lấy mã OTP thành công!', 'Kiểm tra email của bạn')
        localStorage.setItem('email-otp', email)
        props.history.push({
          pathname: props.match.url
        })
      } else {
        openNotification('Lấy mã OTP thất bại!', data.message)
      }
    } catch (error) {
      console.log(error)
      openNotification('Lấy mã OTP thất bại!', 'Kiểm tra cài đặt mạng')
    }
    setIsLoading(false)
    onProcess = false
  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }

  const openNotification = (message, description) => {
    notification.info({
      message,
      description,
      placement: 'bottomLeft',
      duration: 2
    })
  }
  return (
    <div className='otp_frame'>
      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className='otp_form'
        form={form}
      >
        <h1>
          <b className='title'>Quên mật khẩu</b>
        </h1>
        <Text type='warning'>Nhập Email của bạn để nhận mã OTP</Text>
        <br />
        <Form.Item
          name='email'
          rules={[{ required: true, message: 'Hãy nhập E-Mail!' }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Email của bạn'
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='otp-form-button'
            loading={isLoading}
          >
            Nhận mã OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default GetCodeOTP
