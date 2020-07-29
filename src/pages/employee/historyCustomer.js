import React, { useEffect, useState } from "react"
import "./index.css"
import { Table, Input, Tag } from "antd"
import { openNotification } from "../common/index"
import { REST_API } from "../../config/api"

const { Search } = Input

function convert(a) {
  if (a) {
    var unixtimestamp = a
    var months_arr = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ]
    var date = new Date(unixtimestamp * 1000)
    var year = date.getFullYear()
    var month = months_arr[date.getMonth()]
    var day = date.getDate()
    var hours = date.getHours()
    var minutes = "0" + date.getMinutes()
    var seconds = "0" + date.getSeconds()
    var convdataTime = `${hours > 12 ? hours - 12 : hours}:${minutes.substr(
      -2
    )}:${seconds.substr(-2)} ${
      hours > 12 ? "PM" : "AM"
    }, ${month}/${day}/${year} `
    return convdataTime
  } else {
    return ""
  }
}

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toString().toLowerCase())
}
var onProcess = false
const HistoryCustomer = () => {
  const [customer, setCustomer] = useState(null)
  const [dataSend, setDataSend] = useState([])
  const [dataReceive, setDataReceive] = useState([])
  const [dataDept, setDataDept] = useState([])
  const onSearch = async (email) => {
    onProcess = true
    if (!validateEmail(email)) {
      openNotification("Email chưa đúng định dạng!")
      onProcess = false
      return
    }
    const _user = await REST_API.getUserByEmail(email)
    if (_user && _user.results.length > 0) {
      setCustomer(_user.results[0])
    } else {
      openNotification("Không tìm thấy người dùng!")
      onProcess = false
      return
    }

    const data_1 = await REST_API.getHistorySend({ email })
    if (data_1 && data_1.success) {
      setDataSend(
        data_1.results.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          senderEmail: element.sender.email,
          senderNumber: element.sender.number,
          receiverEmail: element.receiver.email,
          receiverNumber: element.receiver.number,
          receiverBankname: element.receiver.bank_name,
          amount: element.amount
            .toLocaleString(undefined, { minimumFractionDigits: 2 })
            .concat(" (VND)"),
          message: element.message,
          createAt: convert(element.createdAt / 1000),
          createAtUNIX: element.paidAt,
        }))
      )
    }
    const data_2 = await REST_API.getHistoryReceive({ email })
    if (data_2 && data_2.success) {
      setDataReceive(
        data_2.results.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          senderEmail: element.sender.email,
          senderNumber: element.sender.number,
          senderBankname: element.sender.bank_name,
          receiverEmail: element.receiver.email,
          receiverNumber: element.receiver.number,
          amount: element.amount
            .toLocaleString(undefined, { minimumFractionDigits: 2 })
            .concat(" (VND)"),
          message: element.message,
          createAt: convert(element.createdAt / 1000),
          createAtUNIX: element.createdAt,
        }))
      )
    }
    const data_3 = await REST_API.getHistoryDept({ email })
    if (data_3 && data_3.success) {
      setDataDept(
        data_3.results.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          fromAccount: element.fromAccount,
          toAccount: element.toAccount,
          amount: element.amount
            .toLocaleString(undefined, { minimumFractionDigits: 2 })
            .concat(" (VND)"),
          msg: element.msg,
          state: element.state,
          // stateTemp: element.state === true ? 'Đã thanh toán' : 'Chưa thanh toán',
          isEnabled: element.isEnabled,
          createAtUNIX: element.paidAt,
          createAt: convert(element.paidAt / 1000),
        }))
      )
    }
    onProcess = false
    return
  }
  const columnsSend = [
    {
      title: "Đến số tài khoản",
      dataIndex: "receiverNumber",
      key: "receiverNumber",
    },
    {
      title: "Ngân hàng",
      dataIndex: "receiverBankname",
      width: "20%",
      editable: false,
      render: (receiverBankname) => (
        <>
          <Tag
            color={(() => {
              switch (receiverBankname.toUpperCase()) {
                case "SACOMBANK":
                  return "green"
                case "HHBANK":
                  return "blue"
                case "AGRIBANK":
                  return "orange"
                default:
                  return "red"
              }
            })()}
            key={receiverBankname}>
            {receiverBankname}
          </Tag>
        </>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Lời nhắn",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "createAt",
      sorter: (a, b) => a.createAtUNIX - b.createAtUNIX,
    },
  ]
  const columnsReceive = [
    {
      title: "Từ số tài khoản",
      dataIndex: "senderNumber",
      key: "senderNumber",
    },
    {
      title: "Ngân hàng",
      dataIndex: "senderBankname",
      width: "20%",
      editable: false,
      render: (senderBankname) => (
        <>
          <Tag
            color={(() => {
              switch (senderBankname.toUpperCase()) {
                case "SACOMBANK":
                  return "green"
                case "HHBANK":
                  return "blue"
                case "AGRIBANK":
                  return "orange"
                default:
                  return "red"
              }
            })()}
            key={senderBankname}>
            {senderBankname}
          </Tag>
        </>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Lời nhắn",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "createAt",
      sorter: (a, b) => a.createAtUNIX - b.createAtUNIX,
    },
  ]
  const columnsDept = [
    {
      title: "Cho số tài khoản",
      dataIndex: "fromAccount",
      key: "fromAccount",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Lời nhắn",
      dataIndex: "msg",
      key: "msg",
    },
    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "createAt",
      sorter: (a, b) => a.createAtUNIX - b.createAtUNIX,
    },
  ]
  return (
    <div className='historyCustomer_frame'>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <span>
          <Search
            placeholder='Nhập email khách hàng'
            enterButton='Search'
            type='email'
            onSearch={(value) => onSearch(value)}
            style={{ width: (window.innerWidth * 1) / 5 }}
          />
        </span>
        <span>
          <h2>
            <b>{customer ? "Khách hàng: ".concat(customer.name) : <br />}</b>
          </h2>
        </span>
      </div>

      <Table
        key='table1'
        title={() => <b>Lịch sử chuyển khoản</b>}
        scroll={{ y: "80vh" }}
        bordered
        pagination={true}
        className='table-data'
        columns={columnsSend}
        dataSource={dataSend}
      />
      <br />
      <Table
        title={() => <b>Lịch sử nhận tiền</b>}
        scroll={{ y: "80vh" }}
        bordered
        pagination={true}
        className='table-data'
        columns={columnsReceive}
        dataSource={dataReceive}
      />
      <br />
      <Table
        title={() => <b>Thanh toán nhắc nợ</b>}
        scroll={{ y: "80vh" }}
        pagination={true}
        bordered
        className='table-data'
        columns={columnsDept}
        dataSource={dataDept}
      />
    </div>
  )
}

export default HistoryCustomer
