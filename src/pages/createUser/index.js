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


  const NewUser = () => {
    const [form] = Form.useForm()
    const onFinish = async (values) => {
      const email = form.getFieldValue("email")
      const phone = form.getFieldValue("phone")
      const pin = form.getFieldValue("pin")
      const password = form.getFieldValue("password")
      const checkmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      const checkpin =  /^([0-9]{6})+$/
      const checkphone = /((09|03|07|08|05)+([0-9]{8})\b)/
      const checkpass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      if ( checkmail.test(email)==false){
        openNotification('Tạo tài khoản thất bại!','Định dạng mail không hợp lệ !')
       
      } else if (checkpin.test(pin)==false){
        openNotification('Tạo tài khoản thất bại!','Mã pin gồm 6 chữ số, hãy nhập lại!')
       
      } else if(checkphone.test(phone)==false | phone.le){
        openNotification('Tạo tài khoản thất bại!','Số điện thoại không đúng định dạng, hãy nhập lại!')
      
      } else if(checkpass.test(password)==false){
        openNotification('Tạo tài khoản thất bại!','Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ và 1 số!')
      }else{
      const data=await REST_API.createUser(values);
      if(data.success==false){
        openNotification('Tạo tài khoản thất bại!',data.message)
      } else{
        openNotification("Tạo thành công !")
        form.resetFields();
     }
    }}
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
   
    return(
      
      
      <Form
          
          {...layout}
          name="createuser"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
         
          
        >
          
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
            
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input your phone!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="pin"
            name="pin"
            rules={[
              {
                required: true,
                message: 'Please input your pin!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
      
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" id="createuser_btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
        )
  }
  
export default NewUser