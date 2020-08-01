import React, { useEffect, useState } from "react"
import "./index.css"
import { DatePicker, Select, Table, Typography } from "antd"
import { REST_API } from "../../config/api"

const { Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const ReportTransacion = () => {
  const [dataSource, setDataSource] = useState([])
  const [bankName, setBankName] = useState("ALL")
  useEffect(() => {
    ;(async () => {
      const data = await REST_API.getReportTransaction({
        bankName: "ALL",
        timeStart: 1,
        timeEnd: Date.now(),
      })
      if (data && data.results) {
        const items = data.results.map((element, index) => ({
          stt: index + 1,
          amount: element.amount.toLocaleString().concat(" (VND)"),
          numberSender: element.sender.number,
          numberReceiver: element.receiver.number,
          createdAt: new Date(element.createdAt).toLocaleString("vi-VI"),
        }))
        setDataSource(items)
      }
    })()
  }, [])
  const onOk = async (value) => {
    let a = value[0] ? new Date(value[0]._d.toString()).getTime() : 1
    let b = value[1] ? new Date(value[1]._d.toString()).getTime() : Date.now()
    const data = await REST_API.getReportTransaction({
      bankName: bankName,
      timeStart: a,
      timeEnd: b,
    })
    if (data && data.results) {
      const items = data.results.map((element, index) => ({
        stt: index + 1,
        amount: element.amount.toLocaleString().concat(" (VND)"),
        numberSender: element.sender.number,
        numberReceiver: element.receiver.number,
        createdAt: new Date(element.createdAt).toLocaleString("vi-VI"),
      }))
      setDataSource(items)
    }
  }
  const handleChangeBank = async (value) => {
    setBankName(value)
    const data = await REST_API.getReportTransaction({
      bankName: value,
      timeStart: 1,
      timeEnd: Date.now(),
    })
    if (data && data.results) {
      const items = data.results.map((element, index) => ({
        stt: index + 1,
        amount: element.amount.toLocaleString().concat(" (VND)"),
        numberSender: element.sender.number,
        numberReceiver: element.receiver.number,
        createdAt: new Date(element.createdAt).toLocaleString("vi-VI"),
      }))
      setDataSource(items)
    }
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Số tiền giao dịch",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tài khoản gửi",
      dataIndex: "numberSender",
      key: "numberSender",
    },
    {
      title: "Tài khoản nhận",
      dataIndex: "numberReceiver",
      key: "numberReceiver",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ]
  return (
    <div className='reportTransaction_frame'>
      <h2>
        <b>Thống kê giao dịch liên ngân hàng</b>
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <Select
          size='default'
          defaultValue='ALL'
          onChange={handleChangeBank}
          style={{ width: 200 }}>
          <Option key='AGRIBANK'>AGRIBANK</Option>
          <Option key='HHBANK'>HHBANK</Option>
          <Option key='ALL'>ALL</Option>
        </Select>
        <RangePicker
          showTime={{ format: "HH:mm" }}
          allowClear={true}
          format='YYYY-MM-DD HH:mm'
          onOk={onOk}
        />
      </div>
      <br />
      <Table
        key='table'
        scroll={{ y: "80vh" }}
        bordered
        className='table-data'
        columns={columns}
        dataSource={dataSource}
        pagination={true}
        bordered
        summary={(pageData) => {
          let totalAmount = 0

          pageData.forEach(({ amount }) => {
            totalAmount += parseInt(amount.match(/\d+/g).join(""))
          })

          return (
            <>
              <Table.Summary.Row key='0'>
                <Table.Summary.Cell key='1'>
                  <b>Tổng tiền giao dịch:</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={4} key='2'>
                  <Text type='primary'>
                    <b>
                      {totalAmount
                        .toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                        .concat(" (VND)")}
                    </b>
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
      />
    </div>
  )
}

export default ReportTransacion
