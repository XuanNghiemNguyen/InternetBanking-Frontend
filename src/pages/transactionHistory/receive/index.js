import React, { useState, useEffect } from 'react'
import './index.css'
import { Table } from 'antd'
import { REST_API } from '../../../config/api'
// import GetCodeOTP from '../../getCodeOTP'
// import { OmitProps } from 'antd/lib/transfer/ListBody'



const HistoryReceive = (props) => {
    const [myAccounts, setMyAccounts] = useState([])
    const [transaction, setTransaction] = useState([])
    const { name, email } = JSON.parse(localStorage.getItem('user-info'))
    function convert(a) {
        if (a) {
            var unixtimestamp = a;
            var months_arr = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
            var date = new Date(unixtimestamp * 1000);
            var year = date.getFullYear();
            var month = months_arr[date.getMonth()];
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var convdataTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' + day + ' ' + month + ' ' + year + ' ';
            return convdataTime;
        }
        else {
            return ''
        }
    }
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
                    createAt: convert(element.createAt/1000),
                    createAtUNIX: element.paidAt,
                })).filter(item => item.receiverEmail === email)
                setTransaction(table)
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
        {
            title: 'Lời nhắn',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createAt',
            key: 'createAt',
            sorter: (a, b) => a.createAtUNIX - b.createAtUNIX,
        },
    ]
    return (

        <div className='reminder_frame'>
            <h1>Lịch sử nhận tiền</h1>
            <Table dataSource={transaction} columns={columns} bordered></Table>
        </div>
    )
}

export default HistoryReceive
