import React, { useState, useEffect } from "react"
import "./index.css"
import { Form, Input, Button } from "antd"
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons"
import { REST_API } from "../../config/api"
import { openNotification } from "../common/index"

const phoneNumberVerify = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  'im'
)

var onProcess = false
const CreateCustomer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const { name, email, phone, password, re_password } = values
      if (!phoneNumberVerify.test(phone)) {
        openNotification(
          'Tạo thất bại',
          'Số điện thoại không đúng!'
        )
        onProcess = false
        setIsLoading(false)
        return
      }
      if (password.length < 8) {
        openNotification(
          'Tạo thất bại',
          'Mật khẩu từ 8 kí tự trở lên!'
        )
        onProcess = false
        setIsLoading(false)
        return
      }
      if (password !== re_password) {
        openNotification(
          'Tạo người dùng thất bại!',
          'Mật khẩu xác nhận không khớp!'
        )
        onProcess = false
        setIsLoading(false)
        return
      }
      const _data = await REST_API.createUser({ email, phone, name, password })
      if (_data && _data.success) {
        openNotification(_data.message, '')
        setIsLoading(false)
        onProcess = false
        form.resetFields()
        return
      } else {
        openNotification('Tạo tài khoản thất bại!', _data && _data.message)
        setIsLoading(false)
        onProcess = false
        return
      }
    } catch (error) {
      console.log(error)
      openNotification('Tạo tài khoản thất bại!', 'Kiểm tra cài đặt mạng')
      setIsLoading(false)
    }
    onProcess = false
  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }
  return (
    <>
      <div className='em_frame'>
        <Form
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className='em_form'
          form={form}>
          <h1>
            <b className='title'>Tạo tài khoản khách hàng</b>
          </h1>
          <Form.Item
            name='name'
            rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}>
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Họ và tên'
            />
          </Form.Item>
          <Form.Item
            name='email'
            rules={[{ required: true, message: "Hãy nhập Email!" }]}>
            <Input
              autoComplete='on'
              prefix={<MailOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            name='phone'
            rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}>
            <Input
              type='number'
              prefix={<PhoneOutlined className='site-form-item-icon' />}
              placeholder='Số điện thoại'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}>
            <Input.Password
              autoComplete='on'
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu'
            />
          </Form.Item>
          <Form.Item
            name='re_password'
            rules={[{ required: true, message: "Hãy nhập lại mật khẩu!" }]}>
            <Input.Password
              autoComplete='on'
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu xác nhận'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='em-form-button'
              loading={isLoading}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default CreateCustomer
