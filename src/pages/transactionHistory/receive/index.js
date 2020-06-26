import React, { useState, useEffect } from 'react'
import './index.css'
import { Form, Input, Button, Modal, message, Table, Space } from 'antd'
import { REST_API } from '../../../config/api'
import GetCodeOTP from '../../getCodeOTP'
import { OmitProps } from 'antd/lib/transfer/ListBody'



const HistoryReceive = (props) => {
    const [myAccounts, setMyAccounts] = useState([])
    const [transaction, setTransaction] = useState([])
    const { email } = localStorage.getItem('user-info')
    useEffect(() => {
        ; (async () => {
            const myAccs = await REST_API.getListAccount(email)
            setMyAccounts(myAccs.results)
            const data = await REST_API.getTransaction()
            if (data && data.transaction) {
                const table = data.transaction.map((element, index) => ({
                    key: (index + 1).toString(),
                    stt: index + 1,
                    senderEmail: element.sender.email,
                    senderNumber: element.sender.number,
                    receiverEmail: element.receiver.email,
                    receiverNumber: element.receiver.number,
                    amount: element.amount,
                    message: element.message,
                  }))
                setTransaction(table)
                console.log(table)
            }
        })()
    }, [email])
    const columns = [
        {
            title: 'Từ số tài khoản',
            dataIndex: 'senderNumber',
            key: 'senderNumber',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
        },
    ]
    return (

        <div className='reminder_frame'>
            <h1>Lịch sử nhận tiền</h1>
            <Table dataSource={transaction} columns={columns} ></Table>
        </div>
    )
}

export default HistoryReceive
