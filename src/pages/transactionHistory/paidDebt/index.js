import React, { useState, useEffect } from "react";
import "./index.css";
import { Table } from "antd";
import { REST_API } from "../../../config/api";
// import GetCodeOTP from '../../getCodeOTP'
// import { OmitProps } from 'antd/lib/transfer/ListBody'

const HistoryDebt = (props) => {
  const [transaction, setTransaction] = useState([]);
  const { email } = JSON.parse(localStorage.getItem("user-info"));
  function convert(a) {
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
      const myNumber = await REST_API.getUserByEmail(email);
      const data = await REST_API.getDebt();
      if (data && data.debt) {
        const table = data.debt
          .map((element, index) => ({
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
          .filter(
            (item) =>
              parseInt(item.toAccount) === parseInt(myNumber.results[0].payment)
          )
          .filter((item) => item.state === true);
        console.log(table);
        setTransaction(table);
      }
    })();
  }, [email]);
  const columns = [
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
  ];
  return (
    <div className="reminder_frame">
      <h1>Lịch sử thanh toán nợ</h1>
      <Table dataSource={transaction} columns={columns}></Table>
    </div>
  );
};

export default HistoryDebt;
