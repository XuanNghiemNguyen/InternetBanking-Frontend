import React, { useEffect, useState } from 'react'
import './index.css'
import { Table, Tag } from 'antd'
import { REST_API } from '../../config/api'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Số tài khoản',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: 'Loại tài khoản',
    key: 'type',
    dataIndex: 'type',
    render: (type) => (
      <>
        <Tag
          color={type.toUpperCase() === 'SAVINGS' ? 'green' : 'blue'}
          key={type}
        >
          {type.toUpperCase() === 'SAVINGS'
            ? 'TÀI KHOẢN TIẾT KIỆM'
            : 'TÀI KHOẢN THANH TOÁN'}
        </Tag>
      </>
    )
  },
  {
    title: 'Số dư khả dụng',
    dataIndex: 'amount',
    key: 'amount'
  }
]

const ListAccount = () => {
  const [data, setData] = useState([])
  const { name, email } = JSON.parse(localStorage.getItem('user-info'))
  useEffect(() => {
    ;(async () => {
      const data = await REST_API.getListAccount(email)
      if (data && data.results) {
        const items = data.results.map((element, index) => ({
          key: index.toString(),
          stt: index,
          number: element.number,
          type: element.isPayment ? 'payments' : 'savings',
          amount: element.balance.toString().concat(' (VND)')
        }))
        setData(items)
      }
    })()
  }, [])
  return (
    <div className='listAccount_frame'>
      <h2>
        Khách hàng: <b>{name}</b>
      </h2>
      <Table className='table-data' columns={columns} dataSource={data} />
    </div>
  )
}

export default ListAccount
