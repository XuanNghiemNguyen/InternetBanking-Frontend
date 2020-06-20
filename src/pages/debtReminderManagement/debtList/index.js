import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button, Modal, message, Table, Space } from 'antd'
import { REST_API } from '../../../config/api'



const DebtList = () => {
  const [myAccounts, setMyAccounts] = useState([])
  const [myDebt, setMyDebt] = useState([])
  const [otherDebt, setOtherDebt] = useState([])
  const [modelVisibility, setModelVisibility] = useState(false)
  const { name, email } = JSON.parse(localStorage.getItem('user-info'))
  const cancelDebt = async (info) => {
    const result = await REST_API.cancelDebt(info)
    if (result.success === true) {
      const newMy = myDebt.filter((i) => {
        return myDebt.findIndex((i) => {
          return (i.fromAccount === info.fromAccount &&
            i.toAccount === info.toAccount &&
            i.amount === info.amount &&
            i.msg === info.msg)
        }) < 0
      })
      const newOther = otherDebt.filter((i) => {
        return otherDebt.findIndex((i) => {
          return (i.fromAccount === info.fromAccount &&
            i.toAccount === info.toAccount &&
            i.amount === info.amount &&
            i.msg === info.msg)
        }) < 0
      })
      setMyDebt(newMy)
      setOtherDebt(newOther)
    }
  }
  const handleOk = async (info) => {
    const payDebt = await REST_API.payDebt(info)
    setModelVisibility(false)
    if (payDebt.success === true) {
      const newOther = otherDebt.filter((i) => {
        return otherDebt.findIndex((i) => {
          return (i.fromAccount === info.fromAccount &&
            i.toAccount === info.toAccount &&
            i.amount === info.amount &&
            i.msg === info.msg)
        }) < 0
      })
      setOtherDebt(newOther)
    }
  };

  const handleCancel = e => {
    setModelVisibility(false)
  };
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
          msg: element.msg,
          state: element.state,
          isEnabled: element.isEnabled
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
      title: 'Đến số tài khoản',
      dataIndex: 'toAccount',
      key: 'toAccount',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Lời nhắn',
      dataIndex: 'msg',
      key: 'msg',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => {
            const debt = {
              fromAccount: text.fromAccount,
              toAccount: text.toAccount,
              amount: text.amount,
              msg: text.msg,
              state: text.state,
              isEnabled: text.isEnabled
            }
            cancelDebt(debt)

          }}>Hủy nhắc nợ</Button>
        </Space>
      ),
    },
  ];
  const columnsTo = [
    {
      title: 'Từ số tài khoản',
      dataIndex: 'fromAccount',
      key: 'fromAccount',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Lời nhắn',
      dataIndex: 'msg',
      key: 'msg',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Modal
            title="Xác nhận"
            visible={modelVisibility}
            onOk={() => {
              const debt = {
                fromAccount: text.fromAccount,
                toAccount: text.toAccount,
                amount: text.amount,
                msg: text.msg,
                state: text.state,
                isEnabled: text.isEnabled
              }
              handleOk(debt)
            }}
            onCancel={handleCancel}
          >
            <p>Người nhận: {text.fromAccount}</p>
            <p>Số tiền: {text.amount}</p>
          </Modal>
          <Button onClick={() => {
            setModelVisibility(true)
          }} >Trả nợ</Button>
          <Button onClick={() => {
            const debt = {
              fromAccount: text.fromAccount,
              toAccount: text.toAccount,
              amount: text.amount,
              msg: text.msg,
              state: text.state,
              isEnabled: text.isEnabled
            }
            cancelDebt(debt)
          }}
          >Hủy nhắc nợ</Button>
        </Space>
      ),
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
