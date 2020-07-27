import React, { useState, useEffect } from 'react'
import './index.css'
import { Table, Menu, Input, Button, Space, Modal } from 'antd'
import { REST_API } from '../../../config/api'
import { UserAddOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
const ManageEmployee = (props) => {
    const [emp, setEmp] = useState()
    const { email } = JSON.parse(localStorage.getItem('user-info'))
    const [modalVisibility, setModalVisibility] = useState(false)
    const [confirmLock, setModalConfirmLock] = useState(false)
    const [modalAddEmployee, setModalAddEmployee] = useState(false)
    const [editingEmpName, setEditingEmpName] = useState('')
    const [editingEmpEmail, setEditingEmpEmail] = useState('')
    const [editingEmpPhone, setEditingEmpPhone] = useState('')
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
                    isEnabled: element.isEnabled
                }))
                setEmp(table)
            }
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
                    isEnabled: element.isEnabled
                }))
                setEmp(table)
            }
        }
    }
    useEffect(() => {
        ; (async () => {
            const getEmp = await REST_API.getEmployeeList(email)
            console.log(getEmp)
            if (getEmp && getEmp.results) {
                const table = getEmp.results.map((element, index) => ({
                    key: index,
                    email: element.email,
                    name: element.name,
                    phone: element.phone,
                    id: element._id,
                    isEnabled: element.isEnabled
                }))

                setEmp(table)
            }

        })()

    }, [email])
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size='middle'>
                    {/* <Button
                        onClick={() => {

                        }}
                    >
                        {text.isEnabled ? 'Khóa' : 'Mở khóa'}
                    </Button> */}
                    <Button
                        onClick={() => {
                            setModalVisibility(true)
                            setEditingEmpName(text.name)
                            setEditingEmpPhone(text.phone)
                            setEditingEmpEmail(text.email)
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        onClick={() => {
                            setModalConfirmLock(true)
                        }}
                    >
                        {text.isEnabled ? 'Khóa' : 'Mở khóa'}
                    </Button>
                    <Modal
                        title={<h2 style={{ width: '80%' }}>Bạn có chắc chắn muốn {text.isEnabled === true ? 'khóa' : 'mở khóa cho'} nhân viên này?</h2>
                        }
                        visible={confirmLock}
                        onOk={() => {
                            setModalConfirmLock(false)
                            const data = {
                                id: text.id
                            }
                            lockEmp(data)
                        }}
                        onCancel={() => {
                            setModalConfirmLock(false)
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ marginRight: 10 }}>Họ và tên:</p>
                            <p>{text.name}</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ marginRight: 10 }}>Email:</p>
                            <p>{text.email}</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ marginRight: 10 }}>Số điện thoại:</p>
                            <p>{text.phone}</p>
                        </div>

                    </Modal>
                    <Modal
                        title='Thông tin nhân viên'
                        visible={modalVisibility}
                        onOk={() => {
                            const data = {
                                _id: text.id,
                                name: editingEmpName,
                                email: editingEmpEmail,
                                phone: editingEmpPhone
                            }
                            setModalVisibility(false)
                            edit(data)

                        }}
                        onCancel={() => { setModalVisibility(false) }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ width: '30%' }}>Họ và tên: </p>
                            <Input value={editingEmpName}
                                onChange={(e) => {
                                    setEditingEmpName(e.target.value)
                                }}
                            ></Input>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ width: '30%' }}>Email: </p>
                            <Input value={editingEmpEmail}
                                onChange={(e) => {
                                    setEditingEmpEmail(e.target.value)
                                }}
                            ></Input>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                        }}>
                            <p style={{ width: '30%' }}>Số điện thoại: </p>
                            <Input value={editingEmpPhone}
                                onChange={(e) => {
                                    setEditingEmpPhone(e.target.value)
                                }}
                            ></Input>
                        </div>
                    </Modal>
                </Space>
            )
        }
    ]
    return (
        <div className='manage-employee'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>DANH SÁCH NHÂN VIÊN</h2>
                <Button
                    style={{ marginRight: 10 }}
                    icon={<UserAddOutlined />}
                    onClick={() => {
                        setModalAddEmployee(true)
                    }}
                >
                    Thêm mới
				</Button>
                <Modal
                    title="Thêm mới nhân viên "
                    visible={modalAddEmployee}
                    onOk={() => {
                        setModalAddEmployee(false)
                    }}
                    onCancel={() => {
                        setModalAddEmployee(false)
                    }}
                >

                </Modal>
            </div>

            <Table className='table' dataSource={emp} columns={columns}>

            </Table>

        </div>
    )
}
export default ManageEmployee