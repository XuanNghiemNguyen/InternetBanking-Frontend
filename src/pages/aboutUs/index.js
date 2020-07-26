import React from "react"
import { Result, Table } from "antd"
import { RocketOutlined } from "@ant-design/icons"

const AboutUs = () => {
  const dataSource = [
    {
      key: "1",
      stt: 1,
      name: "Nguyễn Xuân Nghiêm",
      mssv: 1612427,
    },
    {
      key: "2",
      stt: 2,
      name: "Ngô Trần Nguyễn",
      mssv: 1612447,
    },
    {
      key: "3",
      stt: 3,
      name: "Phùng Trí Cường",
      mssv: 1612074,
    },
  ]

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã số sinh viên",
      dataIndex: "mssv",
      key: "mssv",
    },
  ]
  return (
    <Result
      icon={<RocketOutlined />}
      title={
        <>
          <h2>Phát triển ứng dụng web nâng cao</h2>
          <div style={{margin: 'auto', width: window.innerWidth / 2.5,  borderStyle: 'outset'}}>
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        </>
      }
    />
  )
}

export default AboutUs
