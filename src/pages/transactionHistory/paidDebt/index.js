import React, { useState, useEffect } from 'react'
import './index.css'
import { Table } from 'antd'
import { REST_API } from '../../../config/api'
// import GetCodeOTP from '../../getCodeOTP'
// import { OmitProps } from 'antd/lib/transfer/ListBody'



const HistoryDebt = (props) => {
    const [myAccounts, setMyAccounts] = useState([])
    const [transaction, setTransaction] = useState([])
    const { name, email } = JSON.parse(localStorage.getItem('user-info'))
    function convert(a) {
        if (a) {
            var unixtimestamp = a;
            var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var date = new Date(unixtimestamp * 1000);
            var year = date.getFullYear();
            var month = months_arr[date.getMonth()];
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return convdataTime;
        }
        else {
            return ''
        }
    }
    useEffect(() => {
        ; (async () => {
            const myAccs = await REST_API.getListAccount(email)
            const myNumber = await REST_API.getUserByEmail(email)
            console.log(myNumber)
            console.log(email)
            setMyAccounts(myAccs.results)
            const data = await REST_API.getDebt()
            if (data && data.debt) {

                const table = data.debt.map((element, index) => ({
                    key: (index + 1).toString(),
                    stt: index + 1,
                    fromAccount: element.fromAccount,
                    toAccount: element.toAccount,
                    amount: element.amount,
                    msg: element.msg,
                    state: element.state,
                    // stateTemp: element.state === true ? 'Đã thanh toán' : 'Chưa thanh toán',
                    isEnabled: element.isEnabled,
                    createAtUNIX: element.paidAt,
                    createAt: convert(element.paidAt / 1000)
                }))
                    .filter(item => parseInt(item.toAccount) === parseInt(myNumber.results[0].payment))
                    .filter(item => item.state === true)
                console.log(table)
                setTransaction(table)
            }
        })()
    }, [email])
    const columns = [
        {
            title: 'Cho số tài khoản',
            dataIndex: 'fromAccount',
            key: 'fromAccount',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Lời nhắn',
            dataIndex: 'msg',
            key: 'msg',
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
            <h1>Lịch sử thanh toán nợ</h1>
            <Table dataSource={transaction} columns={columns} ></Table>
        </div>
    )
}

export default HistoryDebt
