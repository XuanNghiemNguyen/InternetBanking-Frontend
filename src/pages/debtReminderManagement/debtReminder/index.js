import React, { useState } from 'react'
import './index.css'
import { Form, Input, Button, Modal, message } from 'antd'
import { REST_API } from '../../../config/api'
import { openNotification } from '../../common';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const DebtReminder = () => {
  const {
    // name, 
    email } = JSON.parse(localStorage.getItem('user-info'))
  const [value, setValue] = useState('')
  const [modelVisibility, setModelVisibility] = useState(false)
  const [infoVisibility, setInfoVisibility] = useState('none')
  const [ngNo, setNgNo] = useState({
    name: '',
    bank_name: '',
    number: ''
  })
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')


  const handleOk = async (e) => {
    if (!amount || !ngNo) {
      openNotification('Nhập thiếu dữ liệu!')
    }
    else {
      openNotification('Đã gửi nhắc nợ')
      const me = await REST_API.getUserByEmail(email)

      const info = {
        fromAccount: me.results[0].payment,
        toAccount: ngNo.number,
        fee: amount * 0.01,
        amount: amount,
        msg: msg
      }
      await REST_API.sendDebt(info)
      setModelVisibility(false)
      setInfoVisibility('none')
      setValue(undefined)
      setAmount('')
      setMsg('')
      setNgNo({
        name: '',
        bank_name: '',
        number: ''
      })
    }

  };

  const handleCancel = e => {
    setModelVisibility(false)
  };
  return (

    <div className='reminder_frame'>
      <h2>
        Tạo nhắc nợ
      </h2>
      <Form
        {...layout}
        name="basic"
      >
        <Form.Item
          label="Số tài khoản"
          name="username"
        >
          <div style={{ display: 'flex' }}>
            <Input type='number' value={value} onChange={(e) => {
              setValue(e.target.value)
            }} />
            <Button onClick={async () => {
              if (!value) {
                openNotification('Xin nhập số tài khoản trước!')
              }
              else {
                const otherInfo = await REST_API.getOtherInfo(value)
                if (otherInfo.success) {
                  setNgNo(otherInfo.user)
                  setInfoVisibility(true)
                }
                else{
                  openNotification('Không tìm thấy người dùng này!')
                }
              }


            }}>Tìm</Button>

          </div>
          <p style={{ display: infoVisibility }}>Tên người nợ : {ngNo ? ngNo.name : ''} </p>
          <p style={{ display: infoVisibility }}>Tên ngân hàng : {ngNo ? ngNo.bank_name : ''}</p>
          <p style={{ display: infoVisibility }}>Số tài khoản : {ngNo ? ngNo.number : ''}</p>
        </Form.Item>
        <Form.Item
          label="Tiền nợ"


          rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <Input style={{ width: '100%' }} value={amount} type="number" onChange={(e) => { setAmount(e.target.value) }} />
        </Form.Item>
        <Form.Item
          label="Lời nhắn"

        >
          <Input value={msg} onChange={(e) => { setMsg(e.target.value) }} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit"
            onClick={() => {
              if (!email || !amount) {
                openNotification('Nhập thiếu dữ liệu!')
              }
              else {
                setModelVisibility(true)
              }

            }}
          >
            Gửi nhắc nợ
        </Button>
        </Form.Item>
        <Modal
          title="Xác nhận"
          visible={modelVisibility}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Người bị gửi nhắc nợ: {ngNo ? ngNo.name : ''}</p>
          <p>Số tiền: {amount}</p>
          <p>Lời nhắn: {msg}</p>
        </Modal>
      </Form>

    </div>
  )
}

export default DebtReminder
