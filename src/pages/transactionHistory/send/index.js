import React, { useState, useEffect } from "react";
import "./index.css";
import { Table, Tag } from "antd";
import { REST_API } from "../../../config/api";
// import GetCodeOTP from '../../getCodeOTP'
// import { OmitProps } from 'antd/lib/transfer/ListBody'

const HistorySend = (props) => {
  const [transaction, setTransaction] = useState([]);
  const { email } = JSON.parse(localStorage.getItem("user-info"));
  function convert(a) {
    console.log(a);
    if (a) {
      var unixtimestamp = a;
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
      ];
      var date = new Date(unixtimestamp * 1000);
      var year = date.getFullYear();
      var month = months_arr[date.getMonth()];
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var convdataTime = `${hours > 12 ? hours - 12 : hours}:${minutes.substr(
        -2
      )}:${seconds.substr(-2)} ${
        hours > 12 ? "PM" : "AM"
      }, ${month}/${day}/${year} `;
      return convdataTime;
    } else {
      return "";
    }
  }
  useEffect(() => {
    (async () => {
      const data = await REST_API.getTransaction();
      if (data && data.transaction) {
        const table = data.transaction
          .map((element, index) => ({
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
          .filter((item) => item.senderEmail === email);
        setTransaction(table);
      }
    })();
  }, [email]);
  const columns = [
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
                  return "green";
                case "HHBANK":
                  return "blue";
                case "AGRIBANK":
                  return "orange";
                default:
                  return "red";
              }
            })()}
            key={receiverBankname}
          >
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
  ];
  return (
    <div className="reminder_frame">
      <h1>Lịch sử gửi tiền</h1>
      <Table dataSource={transaction} columns={columns}></Table>
    </div>
  );
};

export default HistorySend;
