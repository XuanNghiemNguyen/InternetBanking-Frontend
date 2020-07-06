import { Form, Input, Button } from 'antd';
import React from 'react'
import { REST_API } from '../../config/api'
import './index.css'
import { openNotification } from '../common/index'
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
      const onFinish = async (values) => {
        const stk =form.getFieldValue("stk")
        const amount = form.getFieldValue("amount")
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var checkAmount = /^([0-9])+$/;
      
          if(parseFloat(stk)==stk && stk.length!=10){
            openNotification('Nạp tiền thất bại','STK không hợp lệ, hãy nhập lại!')
        } else if(parseFloat(stk)!=stk && filter.test(stk)===false){
          openNotification('Nạp tiền thất bại','Email không hợp lệ, hãy nhập lại!')
        }
        else if (parseFloat(amount)<100000){
          openNotification('Nạp tiền thất bại','Nạp tối thiểu 100.000đ, hãy nhập lại!')
        }
        else if(checkAmount.test(amount)===false){
          openNotification('Nạp tiền thất bại','Số tiền phải là số, hãy nhập lại!')
        }
        else{
        const data=await REST_API.deposit(values);
        if(data.success==false){
          openNotification('Nạp tiền thất bại',data.message)
        } else{
          openNotification('Nạp tiền thành công !')
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