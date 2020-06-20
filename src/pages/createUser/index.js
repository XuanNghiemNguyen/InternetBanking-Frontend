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


  const NewUser = () => {
    const [form] = Form.useForm()
    const onFinish = async (values) => {
      const data=await REST_API.createUser(values);
      console.log(data)
      form.resetFields();
    }
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
            <Button type="primary" htmlType="submit" id="btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
        )
  }
  
export default NewUser