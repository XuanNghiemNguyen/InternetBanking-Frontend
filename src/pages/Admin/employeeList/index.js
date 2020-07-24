import React, { useState, useEffect } from 'react'
import './index.css'
import { Table, Tag, Menu, Input } from 'antd'
import { REST_API } from '../../../config/api'
import { AppstoreOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
const ManageEmployee = (props) => {
    const [emp, setEmp] = useState()
    const { email } = JSON.parse(localStorage.getItem('user-info'))

    useEffect(() => {
        ; (async () => {
            const getEmp = await REST_API.getEmployeeList(email)
            console.log(getEmp.results)
            if (getEmp && getEmp.results) {
                const table = getEmp.results.map((element, index) => ({
                    key: index,
                    email: element.email,
                    name: element.name,
                    phone: element.phone
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

        }
    ]
    return (
        <div className='manage-employee'>
            <h2>DANH SÁCH NHÂN VIÊN</h2>
            <Table className='table' dataSource={emp} columns={columns}>

            </Table>
        </div>
    )
}
export default ManageEmployee