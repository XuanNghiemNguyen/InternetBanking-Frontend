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
          key: (index + 1).toString(),
          stt: index + 1,
          number: element.number,
          type: element.isPayment ? 'payments' : 'savings',
          amount: element.balance
            .toLocaleString(undefined, { minimumFractionDigits: 2 })
            .concat(' (VND)')
        }))
        setData(items)
      }
    })()
  }, [email])
  return (
    <div className='listAccount_frame'>
      <h2>
        Khách hàng: <b>{name}</b>
      </h2>
      <Table
        scroll={{ y: '80vh' }}
        bordered
        className='table-data'
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}

export default ListAccount
