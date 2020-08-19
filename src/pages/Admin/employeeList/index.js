import React, { useState, useEffect } from "react"
import "./index.css"
import { Table, Input, Button, Space, Modal, message } from "antd"
import { REST_API } from "../../../config/api"
import { UserAddOutlined } from "@ant-design/icons"
/* eslint-disable */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
const ManageEmployee = (props) => {
  const [emp, setEmp] = useState()
  const { email } = JSON.parse(localStorage.getItem("user-info"))
  const [modalVisibility, setModalVisibility] = useState(false)
  const [confirmLock, setModalConfirmLock] = useState(false)
  const [modalAddEmployee, setModalAddEmployee] = useState(false)
  const [editingEmpName, setEditingEmpName] = useState("")
  const [editingEmpEmail, setEditingEmpEmail] = useState("")
  const [editingEmpPhone, setEditingEmpPhone] = useState("")
  const [lockEmpName, setLockEmpName] = useState("")
  const [lockEmpEmail, setLockEmpEmail] = useState("")
  const [lockEmpPhone, setLockEmpPhone] = useState("")
  const [lockEmpEnable, setLockEmpEnable] = useState()
  const [lockEmpId, setLockEmpId] = useState("")
  const [addEmpName, setAddEmpName] = useState("")
  const [addEmpEmail, setAddEmpEmail] = useState("")
  const [addEmpPhone, setAddEmpPhone] = useState("")
  const [addEmpPIN, setAddEmpPIN] = useState("")
  const [addEmpPassword, setAddEmpPassword] = useState("")
  const [changePassword, setChangePassword] = useState("")
  const [reChangePassword, setReChangePassword] = useState("")
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [warningPassword, setWarningPassword] = useState("none")
  const [changePassEmpId, setChangePassEmpId] = useState("")
  const [canSubmit, setCanSubmit] = useState(false)
  const edit = async (data) => {
    const results = await REST_API.editEmployee(data)
    if (results.success === true) {
      const getEmp = await REST_API.getEmployeeList(email)
      if (getEmp && getEmp.results) {
        const table = getEmp.results.map((element, index) => ({
          key: index,
          email: element.email,
          name: element.name,
          phone: element.phone,
          id: element._id,
          isEnabled: element.isEnabled,
        }))
        setEmp(table)
      }
    } else {
      message.info("Email này đã được sử dụng, vui lòng nhập email khác!")
    }
  }
  const lockEmp = async (data) => {
    const results = await REST_API.lockEmployee(data)
    if (results.success === true) {
      const getEmp = await REST_API.getEmployeeList(email)
      if (getEmp && getEmp.results) {
        const table = getEmp.results.map((element, index) => ({
          key: index,
          email: element.email,
          name: element.name,
          phone: element.phone,
          id: element._id,
          isEnabled: element.isEnabled,
        }))
        setEmp(table)
      }
    }
  }

  const changePassEmp = async (data) => {
    const results = await REST_API.changePasswordEmployee(data)
    if (results.success === true) {
      const getEmp = await REST_API.getEmployeeList(email)
      if (getEmp && getEmp.results) {
        const table = getEmp.results.map((element, index) => ({
          key: index,
          email: element.email,
          name: element.name,
          phone: element.phone,
          id: element._id,
          isEnabled: element.isEnabled,
        }))
        setEmp(table)
      }
    }
  }
  const AddEmployee = async (data) => {
    const results = await REST_API.AddEmployee(data)
    console.log(results)
    if (results.success === true) {
      const getEmp = await REST_API.getEmployeeList(email)
      if (getEmp && getEmp.results) {
        const table = getEmp.results.map((element, index) => ({
          key: index,
          email: element.email,
          name: element.name,
          phone: element.phone,
          id: element._id,
          isEnabled: element.isEnabled,
        }))
        setEmp(table)
      }
      setAddEmpName("")
      setAddEmpEmail("")
      setAddEmpPhone("")
      setAddEmpPIN("")
      setAddEmpPassword("")
    } else {
      message.info(results.message)
    }
  }
  useEffect(() => {
    ;(async () => {
      const getEmp = await REST_API.getEmployeeList(email)
      if (getEmp && getEmp.results) {
        const table = getEmp.results.map((element, index) => ({
          key: index,
          email: element.email,
          name: element.name,
          phone: element.phone,
          id: element._id,
          isEnabled: element.isEnabled,
        }))
        setEmp(table)
      }
    })()
  }, [email])
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size='middle'>
          <Button
            onClick={() => {
              setModalVisibility(true)
              setEditingEmpName(text.name)
              setEditingEmpPhone(text.phone)
              setEditingEmpEmail(text.email)
            }}>
            Sửa thông tin
          </Button>
          <Button
            onClick={() => {
              setModalConfirmLock(true)
              setLockEmpName(text.name)
              setLockEmpPhone(text.phone)
              setLockEmpEmail(text.email)
              setLockEmpEnable(text.isEnabled)
              setLockEmpId(text.id)
            }}>
            {text.isEnabled ? "Khóa" : "Mở khóa"}
          </Button>
          <Button
            onClick={() => {
              setChangePasswordModal(true)
              setChangePassEmpId(text.id)
            }}>
            Đổi mật khẩu
          </Button>
          <Modal
            title={<h2 style={{ width: "80%" }}>Đổi mật khẩu cho nhân viên</h2>}
            visible={changePasswordModal}
            onCancel={() => {
              setChangePasswordModal(false)
            }}
            onOk={() => {
              setChangePasswordModal(false)
              setChangePassword("")
              setReChangePassword("")
              const data = {
                id: changePassEmpId,
                newPassword: changePassword,
              }
              changePassEmp(data)
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10, width: "50%" }}>Mật khẩu mới:</p>
              <Input
                type='password'
                value={changePassword}
                onChange={(e) => {
                  setChangePassword(e.target.value)
                }}></Input>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10, width: "50%" }}>
                Nhập lại mật khẩu mới:
              </p>
              <Input
                type='password'
                value={reChangePassword}
                onChange={(e) => {
                  setReChangePassword(e.target.value)
                  if (e.target.value !== changePassword) {
                    setWarningPassword("flex")
                  } else {
                    setWarningPassword("none")
                  }
                }}></Input>
            </div>
            <div
              style={{
                display: warningPassword,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10, color: "red", fontSize: 11 }}>
                Nhập lại mật khẩu không trùng khớp
              </p>
            </div>
          </Modal>
          <Modal
            title={
              <h2 style={{ width: "80%" }}>
                Bạn có chắc chắn muốn{" "}
                {lockEmpEnable === true ? "khóa" : "mở khóa cho"} nhân viên này?
              </h2>
            }
            visible={confirmLock}
            onOk={() => {
              setModalConfirmLock(false)
              const data = {
                id: lockEmpId,
              }
              lockEmp(data)
            }}
            onCancel={() => {
              setModalConfirmLock(false)
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10 }}>Họ và tên:</p>
              <p>{lockEmpName}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10 }}>Email:</p>
              <p>{lockEmpEmail}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}>
              <p style={{ marginRight: 10 }}>Số điện thoại:</p>
              <p>{lockEmpPhone}</p>
            </div>
          </Modal>
          <Modal
            title={<h2 style={{ width: "80%" }}>Thông tin nhân viên</h2>}
            visible={modalVisibility}
            onOk={() => {
              const data = {
                _id: text.id,
                name: editingEmpName,
                email: editingEmpEmail,
                phone: editingEmpPhone,
              }
              setModalVisibility(false)
              edit(data)
            }}
            onCancel={() => {
              setModalVisibility(false)
            }}>
            <div className='input-field'>
              <p style={{ width: "30%" }}>Họ và tên: </p>
              <Input
                value={editingEmpName}
                onChange={(e) => {
                  setEditingEmpName(e.target.value)
                }}></Input>
            </div>
            <div className='input-field'>
              <p style={{ width: "30%" }}>Email: </p>
              <Input
                value={editingEmpEmail}
                onChange={(e) => {
                  setEditingEmpEmail(e.target.value)
                }}></Input>
            </div>
            <div className='input-field'>
              <p style={{ width: "30%" }}>Số điện thoại: </p>
              <Input
                value={editingEmpPhone}
                onChange={(e) => {
                  setEditingEmpPhone(e.target.value)
                }}></Input>
            </div>
          </Modal>
        </Space>
      ),
    },
  ]
  return (
    <div className='manage-employee'>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>DANH SÁCH NHÂN VIÊN</h2>
        <Button
          style={{ marginRight: 10 }}
          icon={<UserAddOutlined />}
          onClick={() => {
            setModalAddEmployee(true)
          }}>
          Thêm mới
        </Button>
        <Modal
          title='Thêm mới nhân viên '
          visible={modalAddEmployee}
          okButtonProps={{ disabled: !canSubmit }}
          onOk={() => {
            setModalAddEmployee(false)
            const data = {
              name: addEmpName,
              email: addEmpEmail,
              phone: addEmpPhone,
              pin: addEmpPIN,
              password: addEmpPassword,
            }
            AddEmployee(data)
            setCanSubmit(false)
          }}
          onCancel={() => {
            setModalAddEmployee(false)
          }}>
          <div className='input-field'>
            <p style={{ width: "30%" }}>Họ và tên: </p>
            <Input
              value={addEmpName}
              onChange={(e) => {
                setAddEmpName(e.target.value)
              }}></Input>
          </div>
          <div className='input-field'>
            <p style={{ width: "30%" }}>Email: </p>
            <Input
              type='email'
              rule
              value={addEmpEmail}
              onChange={(e) => {
                setAddEmpEmail(e.target.value)
              }}></Input>
          </div>
          <div className='input-field'>
            <p style={{ width: "30%" }}>Số điện thoại: </p>
            <Input
              value={addEmpPhone}
              type='number'
              onChange={(e) => {
                setAddEmpPhone(e.target.value)
              }}></Input>
          </div>
          <div style={{ display: "none" }} className='input-field'>
            <p style={{ width: "30%" }}>PIN: </p>
            <Input
              value={111111 || addEmpPIN}
              type='number'
              onChange={(e) => {
                setAddEmpPIN(e.target.value)
              }}></Input>
          </div>
          <div className='input-field'>
            <p style={{ width: "30%" }}>Mật khẩu: </p>
            <Input
              value={addEmpPassword}
              type='password'
              onChange={(e) => {
                setAddEmpPassword(e.target.value)
              }}></Input>
          </div>
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              onClick={() => {
                if (!addEmpEmail || !addEmpName || !addEmpPhone || !addEmpPassword) {
                  return message.info("Vui lòng điền đầy đủ thông tin!")
                }
                if (!validateEmail(addEmpEmail)) {
                  return message.info("Email không đúng định dạng!")
                }
                message.info("Thông tin hợp lệ")
                return setCanSubmit(true)
              }}>
              Kiểm tra
            </Button>
          </div>
        </Modal>
      </div>

      <Table className='table' dataSource={emp} columns={columns}></Table>
    </div>
  )
}
export default ManageEmployee
