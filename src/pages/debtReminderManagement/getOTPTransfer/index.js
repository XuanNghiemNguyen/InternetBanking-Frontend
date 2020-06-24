import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button, Typography } from 'antd'
import { openNotification } from '../../common/index'
import { UserOutlined } from '@ant-design/icons'
import { REST_API } from '../../../config/api'

const { Text } = Typography
var onProcess = false

const GetOTPTransfer = (props) => {
  const [gotOTP, setGotOTP] = useState('none')
  const [form] = Form.useForm()
  const { email } = JSON.parse(localStorage.getItem('user-info'))
  useEffect(() => {
    if (localStorage.getItem('email-otp')) {
      form.setFieldsValue({
        email: localStorage.getItem('email-otp')
      })
    }
  }, [form])
  const [isLoading, setIsLoading] = useState(false)
  const getOTP = async () => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const data = await REST_API.getCode(email)
      console.log(data)
      if (data.success) {
        openNotification('Lấy mã OTP thành công!', 'Kiểm tra email của bạn')
        localStorage.setItem('email-otp', email)
        setGotOTP('flex')
        
      } else {
        openNotification('Lấy mã OTP thất bại!', data.message)
      }
    } catch (error) {
      console.log(error)
      openNotification('Lấy mã OTP thất bại!', 'Kiểm tra cài đặt mạng')
    }
    setIsLoading(false)

  }
  const onFinish = async (values) => {
    try {
      onProcess = true;
      setIsLoading(true);
      const email = localStorage.getItem('email-otp');
      if (!email) {
        openNotification(
          'Email không khớp, vui lòng lấy lại OTP!'
        );
        onProcess = false;
        setIsLoading(false);
        return;
      }
      const { code } = values;
      const data = await REST_API.verifyOTP(email, code);
      if (data.success) {
        openNotification('Xac nhan thành công!', '');
        localStorage.setItem('codeSent', false);
        localStorage.removeItem('email-otp');
        props.setOk(false)
        
      } else {
        openNotification('Xac nhan thất bại!', data.message);
      }
    } catch (error) {
      console.log(error);
      openNotification('Xac nhan thất bại!', 'Kiểm tra cài đặt mạng');
    }
    setIsLoading(false);
    onProcess = false;
    console.log('finish')
  }
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }
  return (
    <div>
      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className='otp_form'
        form={form}
      >
        <Form.Item
          name="code"
          rules={[{ required: true, message: 'Bạn phải nhập mã OTP!' }]}
        >
          <Input type='number'
            placeholder="Nhập mã OTP"
          ></Input>
        </Form.Item>
        <Form.Item

        >
          <Button
            type='primary'
            loading={isLoading}
            className='otp-form-button'
            onClick={getOTP}
          >
            Nhận mã OTP
          </Button>
        </Form.Item>
      </Form>
      <p style={{ display: gotOTP }}
      //   
       >
        Nhập mã và nhấn Enter để xác nhận OTP
      </p>
    </div>

  )
}

export default GetOTPTransfer
