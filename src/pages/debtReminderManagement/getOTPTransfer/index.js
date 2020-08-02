import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button } from 'antd'
import { openNotification } from '../../common/index'
// import { UserOutlined } from '@ant-design/icons'
import { REST_API } from '../../../config/api'

// const { Text } = Typography
let onProcess = false

const GetOTPTransfer = (props) => {
  const currentDebt = props.data
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
        openNotification('Xác nhận thành công!', '');
        localStorage.setItem('codeSent', false);
        localStorage.removeItem('email-otp');
        // props.setOk(true)

        const debt = {
          fromAccount: currentDebt.fromAccount,
          toAccount: currentDebt.toAccount,
          amount: currentDebt.amount,
          msg: currentDebt.msg,
          state: currentDebt.state,
          isEnabled: currentDebt.isEnabled,
          fee: currentDebt.amount * 0.01
        }
        transfer(debt)
        props.reload()
      } else {
        openNotification('Xác nhận thất bại!', data.message);
      }
    } catch (error) {
      console.log(error);
      openNotification('Xác nhận thất bại!', 'Kiểm tra cài đặt mạng');
    }
    setIsLoading(false);
    onProcess = false;
    console.log('finish')
  }
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }
  const transfer = async (info) => {
    const payDebt = await REST_API.payDebt(info)
    if (payDebt.success === true) {
      props.reload()
    }

    // setModelVisibility(false)
    // if (payDebt.success === true) {
    // const myAccs = await REST_API.getListAccount(email)
    // setMyAccounts(myAccs.results)
    // const data = await REST_API.getDebt()
    // if (data && data.debt) {
    //   const items = data.debt.map((element, index) => ({
    //     key: (index + 1).toString(),
    //     stt: index + 1,
    //     fromAccount: element.fromAccount,
    //     toAccount: element.toAccount,
    //     amount: element.amount,
    //     msg: element.msg,
    //     state: element.state,
    //     stateTemp: element.state === true ? 'Đã thanh toán' : 'Chưa thanh toán',
    //     isEnabled: element.isEnabled
    //   }))
    // setMyDebt(
    //   items.filter((item) => {
    //     return (myAccs.results.findIndex(function (i) {
    //       return i.number.toString() === item.fromAccount.toString()
    //     })) >= 0
    //   })
    // )
    // setOtherDebt(
    //   items.filter((item) => {
    //     return (myAccs.results.findIndex(function (i) {
    //       return i.number.toString() === item.toAccount.toString()
    //     })) >= 0
    //   })
    // )
    // }
    // }
  };
  return (
    <div>
      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className='otp_form_transfer'
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
            className='otp-form-button-transfer'
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
