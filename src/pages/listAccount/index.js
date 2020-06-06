import React from 'react'
import './index.css'
import { Table, Tag, Space } from 'antd'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
    render: (type) => (
      <>
        <Tag color={type.toUpperCase() === 'SAVINGS' ? 'green' : 'blue'} key={type}>
          {type.toUpperCase() === 'SAVINGS' ? 'TÀI KHOẢN TIẾT KIỆM' : 'TÀI KHOẢN THANH TOÁN'}
        </Tag>
      </>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount'
  }
]

const data = [
  {
    key: '1',
    stt: 1,
    number: '452434324523',
    type: 'payments',
    amount: 5000000
  },
  {
    key: '2',
    stt: 2,
    number: '452434324523',
    type: 'savings',
    amount: 5000000
  },
  {
    key: '3',
    stt: 3,
    number: '452434324523',
    type: 'savings',
    amount: 5000000
  }
]
const customer = {
  name: 'Nguyễn Xuân Nghiêm'
}
const ListAccount = () => {
  return (
    <div className='listAccount_frame'>
      <h2>Khách hàng: <b>{customer.name}</b></h2>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default ListAccount
