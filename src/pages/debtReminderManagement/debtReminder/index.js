import React, { useEffect, useState } from 'react'
import './index.css'
import { Table, Tag, Form, Input, Button, Modal, message, InputNumber } from 'antd'
import { REST_API } from '../../../config/api'


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const DebtReminder = () => {
  // const [data, setData] = useState([])
  const { name, email } = JSON.parse(localStorage.getItem('user-info'))
  const [data, setData] = useState([])
  const [value, setValue] = useState(undefined)
  const [modelVisibility, setModelVisibility] = useState(false)
  const [infoVisibility, setInfoVisibility] = useState('none')
  const [ngNo, setNgNo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => {
    ; (async () => {
      const data = await REST_API.getOtherUser(email)
      if (data && data.results) {
        const items = data.results.map((element, index) => ({
          key: index.toString(),
          stt: index,
          payment: element.payment,
          type: element.isPayment ? 'payments' : 'savings',
          email: element.email
        }))
        setData(items)
      }
    })()
  }, [])
  // const onFinish = values => {
  //   console.log('Success:', values);

  // };

  // const onFinishFailed = errorInfo => {
  //   console.log('Failed:', errorInfo);
  // };

  const handleOk = e => {
    setModelVisibility(false)
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
        // initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Số tài khoản"
          name="username"
        // rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <div style={{ display: 'flex' }}>
            <Input type='number' onChange={(e) => {
              setValue(e.target.value)
            }} />
            <Button onClick={async () => {
              const findAcc = (data.filter(function (item) {
                return (item.payment === parseInt(value))
              }))
              if (findAcc.length !== 0) {
                const temp = await REST_API.getUserByEmail(findAcc[0].email)
                setNgNo(temp.results[0])
                setInfoVisibility('flex')
              }
              else {
                setNgNo()
                message.info('Không tìm thấy người dùng này!')
              }
            }}>Tìm</Button>

          </div>
          <p style={{ display: infoVisibility }}>Tên người nợ: {ngNo ? ngNo.name : ''} </p>
          <p style={{ display: infoVisibility }}>Email: {ngNo ? ngNo.email : ''}</p>
          <p style={{ display: infoVisibility }}>Số điện thoại: {ngNo ? ngNo.phone : ''}</p>
        </Form.Item>
        <Form.Item
          label="Tiền nợ"

          name='amount'
          rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <Input style={{ width: '100%' }} type="number" onChange={(e)=>{setAmount(e.target.value)}} />
        </Form.Item>
        <Form.Item
          label="Lời nhắn"
          name='message'
        >
          <Input onChange={(e)=>{setMsg(e.target.value)}}/>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit"
            onClick={() => { setModelVisibility(true) }}
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
          <p>Người bị gửi nhắc nợ: {ngNo.name}</p>
          <p>Số tiền: {amount}</p>
          <p>Lời nhắn: {msg}</p>
        </Modal>
      </Form>

    </div>
  )
}

export default DebtReminder
