import React, { useState } from 'react'
import './index.css'
import { openNotification } from '../common/index'
import { Form, Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { REST_API } from '../../config/api'

var onProcess = false

const ChangePassword = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const { old_password, new_password, new_password_confirm } = values
      if (new_password !== new_password_confirm) {
        openNotification(
          'Lấy mật khẩu thất bại!',
          'Mật khẩu xác nhận không khớp!'
        )
        onProcess = false
        setIsLoading(false)
        return
      }
      const data = await REST_API.changePassword(old_password, new_password)
      if (data.success) {
        openNotification('Đổi mật khẩu thành công!', '')
        props.history.push('login')
      } else {
        openNotification('Đổi mật khẩu thất bại!', data.message)
      }
    } catch (error) {
      console.log(error)
      openNotification('Đổi mật khẩu thất bại!', 'Kiểm tra cài đặt mạng')
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
            <b className='title'>Đổi mật khẩu</b>
          </h1>
          <Form.Item
            name='old_password'
            rules={[{ required: true, message: 'Hãy nhập mật khẩu cũ!' }]}
          >
            <Input.Password
              autoComplete='on'
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu cũ'
            />
          </Form.Item>
          <Form.Item
            name='new_password'
            rules={[{ required: true, message: 'Hãy nhập mật khẩu mới!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu mới'
            />
          </Form.Item>
          <Form.Item
            name='new_password_confirm'
            rules={[{ required: true, message: 'Nhập lại mật khẩu mới !' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Nhập lại mật khẩu'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={isLoading}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default ChangePassword
