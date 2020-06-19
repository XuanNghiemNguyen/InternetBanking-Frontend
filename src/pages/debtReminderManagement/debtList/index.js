import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button, Modal, message, Table } from 'antd'
import { REST_API } from '../../../config/api'



const DebtList = () => {
  const [myAccounts, setMyAccounts] = useState([])
  const [myDebt, setMyDebt] = useState([])
  const [otherDebt, setOtherDebt] = useState([])
  const { name, email } = JSON.parse(localStorage.getItem('user-info'))
  useEffect(() => {
    ; (async () => {
      const myAccs = await REST_API.getListAccount(email)
      setMyAccounts(myAccs.results)
      const data = await REST_API.getDebt()
      if (data && data.debt) {
        const items = data.debt.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          fromAccount: element.fromAccount,
          toAccount: element.toAccount,
          amount: element.amount,
          msg: element.msg
        }))
        setMyDebt(
          items.filter((item) => {
            return (myAccs.results.findIndex(function (i) {
              return i.number.toString() === item.fromAccount.toString()
            })) >= 0
          })
        )
        setOtherDebt(
          items.filter((item) => {
            return (myAccs.results.findIndex(function (i) {
              return i.number.toString() === item.toAccount.toString()
            })) >= 0
          })
        )
      }

    })()
  }, [email])
  const columnsFrom = [
    {
      title: 'To Acc',
      dataIndex: 'toAccount',
      key: 'toAccount',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Message',
      dataIndex: 'msg',
      key: 'msg',
    },
  ];
  const columnsTo = [
    {
      title: 'From Acc',
      dataIndex: 'fromAccount',
      key: 'fromAccount',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Message',
      dataIndex: 'msg',
      key: 'msg',
    },
  ];
  return (

    <div className='reminder_frame'>
      <div>
        <p>Danh sách nợ đã gửi</p>
        <Table dataSource={myDebt} columns={columnsFrom} ></Table>
      </div>
      <div>
        <p>Danh sách nợ được gửi</p>
        <Table dataSource={otherDebt} columns={columnsTo} ></Table>
      </div>

    </div>
  )
}

export default DebtList
