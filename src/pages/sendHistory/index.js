import { Form,Input, Button } from 'antd';
import React,{  useState } from 'react'
import { REST_API } from '../../config/api'
import { Table, Tag } from 'antd'
import './index.css'
import { openNotification } from '../common/index'
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Tài khoản gửi',
    dataIndex: 'sender',
    key: 'sender'
  },
  {
    title: 'Tài khoản nhận',
    dataIndex: 'receiver',
    key: 'receiver'
  },
  
  {
    title: 'Số Tiền',
    dataIndex: 'amount',
    key: 'amount'
  }
]

const layout = [{
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}];
const tailLayout =[ {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}];

  const SendHistory = () => {
    const [data, setData] = useState([])
      const [form] = Form.useForm()
      const onFinish = async (values) => {
        const stk =form.getFieldValue("stk")
          if(parseFloat(stk)==stk && stk.length!=10){
            openNotification('Thất bại!','STK không hợp lệ, hãy nhập lại!')
            form.resetFields()
          }
        else{
        const data=await REST_API.sendHistory(values);
        if(data.success==false){
          openNotification('Thất bại!',data.message)
          form.resetFields()
        } else{
          console.log(data.result)
          const items = data.result.map((element, index) => ({
            key: (index + 1).toString(),
            stt: index + 1,
            sender: element.sender.number,
            receiver:element.receiver.number,
            amount: element.amount
              .toLocaleString(undefined, { minimumFractionDigits: 2 })
              .concat(' (VND)')
          }))
          setData(items)
         
          document.getElementById('senderListHistory').classList.remove("hide")
         document.getElementById('senderListHistory').classList.add("show")
    }}};
    
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    return(

      <Form
          
          {...layout}
          form={form}
          name="sendhistory"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
         
        >  
        <Form.Item
            label="STK"
            name="stk"
            rules={[
              {
                required: true,
                message: 'Please input your id account !',
              },
            ]}
            
          >
            <Input />
          </Form.Item>
      
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" id="sendhistory_btn">
              Submit
            </Button>
          </Form.Item>
          <div id='senderListHistory' className="hide">
      <Table
        scroll={{ y: '80vh' }}
        bordered
        className='table-data'
        columns={columns}
        dataSource={data}
      />
    </div>
        </Form>
        
        )
  }
  
export default SendHistory