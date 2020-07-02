import { Form, Input, Button } from 'antd';
import React from 'react'
import { REST_API } from '../../config/api'
import './index.css'
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
   
      const [form] = Form.useForm()
      const stk =form.getFieldValue("stk")
      console.log(stk)
      const onFinish = async (values) => {
        const stk =form.getFieldValue("stk")
        
        
      
          if(parseFloat(stk)==stk && stk.length!=10){
            alert("STK không hợp lệ, hãy nhập lại!")
            form.resetFields()
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
                message: 'Please input your id account or email!',
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
  
export default SendHistory