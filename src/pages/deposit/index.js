import { Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { REST_API } from '../../config/api'
import './index.css'
const axios = require('axios');
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

  const Deposit = () => {
   
      const [form] = Form.useForm()
      const stk =form.getFieldValue("stk")
      console.log(stk)
      const onFinish = async (values) => {
        const stk =form.getFieldValue("stk")
        const amount = form.getFieldValue("amount")
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var checkAmount = /^([0-9])+$/;
      
          if(parseFloat(stk)==stk && stk.length!=10){
            alert("STK không hợp lệ, hãy nhập lại!")
            form.resetFields()
        } else if(parseFloat(stk)!=stk && filter.test(stk)===false){
          alert("Email không hợp lệ, hãy nhập lại!")
          form.resetFields()
        }
        else if (parseFloat(amount)<100000){
          alert("Nạp tối thiểu 100.000đ, hãy nhập lại!")
          form.resetFields()
        }
        else if(checkAmount.test(amount)===false){
          alert("Số tiền phải là số, hãy nhập lại!")
        }
        else{
        const data=await REST_API.deposit(values);
        if(data.success==false){
          alert(data.message)
          form.resetFields()
        } else{
        alert("Nạp tiền thành công !")
        form.resetFields()}}
    };
    
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    return(

      <Form
          
          {...layout}
          form={form}
          name="deposit"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
         
        >
          <Form.Item
            label="idAccount/Email"
            name="stk"
            rules={[
              {
                required: true,
                message: 'Please input your id account or email!',
              },
            ]}
            
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: 'Please fill the amount of money!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          
      
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" id="deposit_btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
        )
  }
  
export default Deposit