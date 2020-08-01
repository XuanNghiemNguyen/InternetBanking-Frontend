import React, { useState, useEffect } from "react";
import "./index.css";
import { Button, Modal, Table, Space } from "antd";
import { REST_API } from "../../../config/api";
import GetOTPTransfer from "../getOTPTransfer";

const DebtList = (props) => {
  const [currentDebt, setCurrentDebt] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    msg: "",
    state: "",
    isEnabled: "",
    fee: "",
  });
  const [ok, setOk] = useState(false);

  const [myAccounts, setMyAccounts] = useState([]);

  const [myDebt, setMyDebt] = useState([]);
  const [otherDebt, setOtherDebt] = useState([]);
  const [modelVisibility, setModelVisibility] = useState(false);
  const { email } = JSON.parse(localStorage.getItem("user-info"));
  const cancelDebt = async (info) => {
    const result = await REST_API.cancelDebt(info, email);
    if (result.success === true) {
      const myAccs = await REST_API.getListAccount(email);
      setMyAccounts(myAccs.results);
      const data = await REST_API.getDebt();
      if (data && data.debt) {
        const items = data.debt.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          fromAccount: element.fromAccount,
          toAccount: element.toAccount,
          amount: element.amount,
          msg: element.msg,
          state: element.state,
          stateTemp:
            element.state === true ? "Đã thanh toán" : "Chưa thanh toán",
          isEnabled: element.isEnabled,
        }));
        setMyDebt(
          items.filter((item) => {
            return (
              myAccs.results.findIndex(function (i) {
                return i.number.toString() === item.fromAccount.toString();
              }) >= 0
            );
          })
        );
        setOtherDebt(
          items.filter((item) => {
            return (
              myAccs.results.findIndex(function (i) {
                return i.number.toString() === item.toAccount.toString();
              }) >= 0
            );
          })
        );
      }
    }
  };

  const handleCancel = (e) => {
    setModelVisibility(false);
  };
  useEffect(() => {
    (async () => {
      const myAccs = await REST_API.getListAccount(email);
      setMyAccounts(myAccs.results);
      const data = await REST_API.getDebt();
      console.log(data);
      if (data && data.debt) {
        const items = data.debt.map((element, index) => ({
          key: (index + 1).toString(),
          stt: index + 1,
          fromAccount: element.fromAccount,
          toAccount: element.toAccount,
          amount: element.amount,
          amountTemp: element.amount
            .toLocaleString(undefined, { minimumFractionDigits: 2 })
            .concat(" (VND)"),
          msg: element.msg,
          state: element.state,
          stateTemp:
            element.state === true ? "Đã thanh toán" : "Chưa thanh toán",
          isEnabled: element.isEnabled,
        }));
        setMyDebt(
          items.filter((item) => {
            return (
              myAccs.results.findIndex(function (i) {
                return i.number.toString() === item.fromAccount.toString();
              }) >= 0
            );
          })
        );
        setOtherDebt(
          items.filter((item) => {
            return (
              myAccs.results.findIndex(function (i) {
                return i.number.toString() === item.toAccount.toString();
              }) >= 0
            );
          })
        );
      }
    })();
  }, [email]);
  const columnsFrom = [
    {
      title: "Đến số tài khoản",
      dataIndex: "toAccount",
      key: "toAccount",
    },
    {
      title: "Số tiền",
      dataIndex: "amountTemp",
      key: "amountTemp",
    },

    {
      title: "Lời nhắn",
      dataIndex: "msg",
      key: "msg",
    },
    {
      title: "Trạng thái",
      dataIndex: "stateTemp",
      key: "stateTemp",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            disabled={!text.isEnabled || text.state}
            onClick={() => {
              const debt = {
                fromAccount: text.fromAccount,
                toAccount: text.toAccount,
                amount: text.amount,
                msg: text.msg,
                state: text.state,
                isEnabled: text.isEnabled,
                fee: text.amount * 0.01,
              };
              cancelDebt(debt);
            }}
          >
            Hủy nhắc nợ
          </Button>
        </Space>
      ),
    },
  ];
  const columnsTo = [
    {
      title: "Từ số tài khoản",
      dataIndex: "fromAccount",
      key: "fromAccount",
    },
    {
      title: "Số tiền",
      dataIndex: "amountTemp",
      key: "amountTemp",
    },
    {
      title: "Lời nhắn",
      dataIndex: "msg",
      key: "msg",
    },
    {
      title: "Trạng thái",
      dataIndex: "stateTemp",
      key: "stateTemp",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button
              disabled={text.state || !text.isEnabled}
              onClick={() => {
                setCurrentDebt(text);
                setModelVisibility(true);
              }}
            >
              Trả nợ
            </Button>
            <Button
              disabled={!text.isEnabled || text.state}
              onClick={() => {
                const debt = {
                  fromAccount: text.fromAccount,
                  toAccount: text.toAccount,
                  amount: text.amount,
                  msg: text.msg,
                  state: text.state,
                  isEnabled: text.isEnabled,
                };
                cancelDebt(debt);
              }}
            >
              Hủy nhắc nợ
            </Button>
          </Space>
        );
      },
    },
  ];

  const reload = async () => {
    setModelVisibility(false);
    const myAccs = await REST_API.getListAccount(email);
    setMyAccounts(myAccs.results);
    const data = await REST_API.getDebt();
    if (data && data.debt) {
      const items = data.debt.map((element, index) => ({
        key: (index + 1).toString(),
        stt: index + 1,
        fromAccount: element.fromAccount,
        toAccount: element.toAccount,
        amount: element.amount,
        amountTemp: element.amount
          .toLocaleString(undefined, { minimumFractionDigits: 2 })
          .concat(" (VND)"),
        msg: element.msg,
        state: element.state,
        stateTemp: element.state === true ? "Đã thanh toán" : "Chưa thanh toán",
        isEnabled: element.isEnabled,
      }));
      setMyDebt(
        items.filter((item) => {
          return (
            myAccs.results.findIndex(function (i) {
              return i.number.toString() === item.fromAccount.toString();
            }) >= 0
          );
        })
      );
      setOtherDebt(
        items.filter((item) => {
          return (
            myAccs.results.findIndex(function (i) {
              return i.number.toString() === item.toAccount.toString();
            }) >= 0
          );
        })
      );
    }

    // }
  };
  return (
    <div className="reminder_frame">
      <div>
        <p>Danh sách nợ đã gửi</p>
        <Table dataSource={myDebt} columns={columnsFrom} bordered></Table>
      </div>
      <div>
        <p>Danh sách nợ được gửi</p>
        <Table dataSource={otherDebt} columns={columnsTo} bordered></Table>
      </div>
      <Modal
        title="Xác nhận"
        visible={modelVisibility}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleCancel}
      >
        <p>Người nhận: {currentDebt.fromAccount}</p>
        <p>Số tiền: {currentDebt.amount}</p>
        <p>Phí giao dịch: {currentDebt.amount * 0.01}</p>
        <GetOTPTransfer
          data={currentDebt}
          setOk={setOk}
          reload={reload}
        ></GetOTPTransfer>
      </Modal>
    </div>
  );
};

export default DebtList;
