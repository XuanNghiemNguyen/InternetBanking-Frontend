import React, { useState } from 'react'
import { Form, Input, Button, Typography, Row, Col } from 'antd'
const { Text } = Typography

function OtpConfirm({ transfer, resendOTP }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState('false')
  const confirmAndTranfer = async () => {
    const otp = form.getFieldValue('OTP')
    await transfer(otp)
  }
  return (
    <Form style={{ borderStyle: 'ridge', padding: '2vw' }} form={form}>
      <Text underline type='danger' strong>
        Kiểm tra và xác thực mã OTP từ email đăng kí của bạn!
      </Text>
      <Row style={{ paddingTop: 15 }}>
        <Col span={12}>
          <Form.Item
            name='OTP'
            label='Xác thực OTP'
            rules={[
              {
                required: true,
                message: 'Bạn phải xác thực OTP',
              },
            ]}
          >
            <Input type='number' />
          </Form.Item>
        </Col>
        <Col span={1} />
        <Col span={3}>
          <Form.Item>
            <Button
              type='dashed'
              htmlType='button'
              loading={loading === 'sendCode'}
              onClick={ async () => {
                setLoading('sendCode')
                await resendOTP()
                setLoading('false')
              }}
            >
              Gửi lại mã
            </Button>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item>
            <Button
              type='primary'
              htmlType='button'
              loading={loading === 'confirm'}
              onClick={async () => {
                setLoading('confirm')
                await confirmAndTranfer()
                setLoading('false')
              }}
            >
              Xác nhận & Chuyển ngay
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
export default OtpConfirm
// import React from 'react';

// function CompanyIconInHeader() {
//   return <span>y</span>;
// }

// export default CompanyIconInHeader;
