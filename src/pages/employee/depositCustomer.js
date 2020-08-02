import React, { useState } from "react"
import "./index.css"
import { Form, Input, Button } from "antd"
import { CodeOutlined, FieldNumberOutlined } from "@ant-design/icons"
import { REST_API } from "../../config/api"
import { openNotification } from "../common/index"
/* eslint-disable */

let onProcess = false
const DepositCustomer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFinding, setIsFinding] = useState(false)
  const [statusFound, setStatusFound] = useState("warning")
  const [form] = Form.useForm()
  const searchAccount = async () => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsFinding(true)
      const email_or_number = form.getFieldValue("email_or_number")
      const _data = await REST_API.getAccountByEmailOrNumber({
        email_or_number,
      })
      if (_data && _data.success) {
        openNotification(
          `Tên: ${_data.results.name}`,
          `Loại tài khoản: ${_data.results.typeAccount}`
        )
        setStatusFound("success")
      } else {
        openNotification("Không tìm thấy tài khoản này!", "")
        setStatusFound("warning")
      }
      onProcess = false
      setIsFinding(false)
    } catch (err) {
      onProcess = false
      setIsFinding(false)
      console.log(err.toString())
      openNotification(err.toString())
    }
  }
  const onFinish = async (values) => {
    try {
      if (!!onProcess) return
      onProcess = true
      setIsLoading(true)
      const { email_or_number, amount } = values
      const _data = await REST_API.depositCustomer({
        email_or_number,
        amount
      })
      if (_data && _data.success) {
        openNotification("Nạp tiền thành công")
        form.resetFields()
      } else {
        openNotification("Nạp tiền thất bại!", _data.message)
      }
      onProcess = false
      setIsLoading(false)
    } catch (err) {
      onProcess = false
      setIsLoading(false)
      console.log(err.toString())
      openNotification(err.toString())
    }
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
            <b className='title'>Nạp tiền cho khách hàng</b>
          </h1>
          <Form.Item
            name='email_or_number'
            validateStatus={statusFound}
            hasFeedback
            rules={[
              { required: true, message: "Hãy nhập email hoặc số tài khoản!" },
            ]}>
            <Input
              prefix={<CodeOutlined className='site-form-item-icon' />}
              placeholder='Email hoặc số tài khoản'
              suffix={
                <Button loading={isFinding} onClick={searchAccount}>
                  Tìm
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name='amount'
            rules={[
              {
                required: true,
                message: "Hãy nhập số tiền cần nạp!",
              },
            ]}>
            <Input
              type='number'
              min={10000}
              step={10000}
              prefix={<FieldNumberOutlined className='site-form-item-icon' />}
              placeholder='Số tiền cần nạp'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='em-form-button'
              disabled={statusFound === "warning"}
              loading={isLoading}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default DepositCustomer
