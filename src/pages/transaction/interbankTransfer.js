import React, { useState, useEffect } from 'react'
import {
  Form,
  Select,
  Divider,
  Input,
  Button,
  Steps,
  InputNumber,
  Row,
  Col,
  Tooltip,
  Radio,
  message,
  Typography,
} from 'antd'

import { SearchOutlined } from '@ant-design/icons'
import { REST_API } from '../../config/api'
import { openNotification } from '../common/index'
import OtpConfirm from './otpConfirm'

import './index.css'
const { Text } = Typography
const { Step } = Steps
const { Option, OptGroup } = Select
let form_data = {}
let isNewReceiver = false
let newAccountReceiver = {}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const InterbankTransfer = (props) => {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [listAccount, setListAccount] = useState([])
  const [listAccountReceiver, setListAccountReceiver] = useState([])
  const { email } = JSON.parse(localStorage.getItem('user-info'))
  const [optionReceiver, setOptionReceiver] = useState(true)
  const [validateStatus, setValidateStatus] = useState('success')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [isDone, setIsDone] = useState(false)
  useEffect(() => {
    const getAccount = async () => {
      const data = await REST_API.getListAccount(email)
      if (data && data.results) {
        const { number } =
          data.results.find((item) => item.isPayment) ||
          data.results.filter((item) => !item.isPayment)[0]
        form.setFieldsValue({ numberResource: number })
        setListAccount(data.results)
      }
      const _data = await REST_API.getReceivers()
      if (_data && _data.receivers && _data.receivers.length > 0) {
        const internalReceiver = _data.receivers.filter(
          (i) => i.bank_name === 'SACOMBANK'
        )
        setListAccountReceiver([...internalReceiver])
        form.setFieldsValue({ numberReceiver: _data.receivers[0].number })
      }
      form.setFieldsValue({ receiverOption: 'Danh sách đã lưu' })
    }
    getAccount()
  }, [email])

  const onChangeAccountResource = (value) => {
    form.setFieldsValue({ numberResource: value })
  }
  const onChangeAccountReceiver = (value) => {
    form.setFieldsValue({ numberReceiver: value })
  }

  const confirmReceiver = async () => {
    const number = form.getFieldValue('newNumberReceiver')
    if (!number || isNaN(number)) {
      setValidateStatus('error')
      openNotification('Truy vấn thất bại', 'Xin vui lòng nhập số tài khoản!')
      return
    }
    const data = await REST_API.getOtherInfo(number)
    if (data && data.success) {
      setValidateStatus('success')
      newAccountReceiver = { ...data.user }
      openNotification('Thông tin người nhận', 'Tên: ' + data.user.name)
      return
    } else {
      setValidateStatus('error')
      openNotification('Truy vấn thất bại', 'Sô tài khoản không tồn tại')
      return
    }
  }
  //
  const AccountSelect = ({ arr }) => {
    let payment = {}
    let savings = []
    if (arr && arr.length > 0) {
      payment = arr.find((item) => item.isPayment)
      savings = arr.filter((item) => !item.isPayment)
      return (
        <Select
          // style={{ width: '40vw' }}
          onChange={(value) => onChangeAccountResource(value)}
          defaultValue={payment.number || savings[0].number}
        >
          <OptGroup label='Tài khoản thanh toán'>
            <Option value={payment.number}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <b>{payment.number}</b>
                </span>
                <span>({payment.balance.toLocaleString()} VND)</span>
              </div>
            </Option>
          </OptGroup>
          <OptGroup label='Tài khoản tiết kiệm'>
            {savings.map((item, idx) => (
              <Option value={item.number} key={idx}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    <b>{item.number}</b>
                  </span>
                  <span>({item.balance.toLocaleString()} VND)</span>
                </div>
              </Option>
            ))}
          </OptGroup>
        </Select>
      )
    } else {
      return (
        <div>
          <Select>
            <Option disabled>Không có dữ liệu</Option>
          </Select>
        </div>
      )
    }
  }

  const ReceiverOption = () => (
    <Form.Item name='receiverOption'>
      <Select
        onChange={(value) => {
          form.setFieldsValue({
            receiverOption: value ? 'Danh sách đã lưu' : 'Người nhận mới',
          })
          setOptionReceiver(value)
          setValidateStatus(!value ? 'warning' : 'success')
        }}
      >
        <Option value={true}>Danh sách đã lưu</Option>
        <Option value={false}>Người nhận mới</Option>
      </Select>
    </Form.Item>
  )

  const AccountReceiver = ({ arr }) => {
    if (arr && arr.length > 0) {
      return (
        <Select
          onChange={(value) => {
            onChangeAccountReceiver(value)
          }}
          defaultValue={arr[0].number}
        >
          {arr.map((item, idx) => (
            <Option value={item.number} key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <b>{item.reminiscent_name}</b>
                </span>
                <span>
                  (<b>{item.number}</b>)
                </span>
              </div>
            </Option>
          ))}
        </Select>
      )
    } else {
      return (
        <div>
          <Select>
            <Option disabled>Không có dữ liệu</Option>
          </Select>
        </div>
      )
    }
  }
  const checkForm = async () => {
    setLoading(true)
    if (validateStatus !== 'success') {
      openNotification(
        'Yêu cầu biểu mẫu',
        'Thông tin tài khoản nhận không chính xác!'
      )
      setLoading(false)
      return
    }
    const {
      numberResource,
      numberReceiver,
      newNumberReceiver,
      amount,
      isSenderPaidFee,
      message,
    } = form.getFieldsValue()
    isNewReceiver = !!!numberReceiver
    if (!amount || amount < 10000) {
      openNotification(
        'Yêu cầu biểu mẫu',
        'Số tiền cần chuyển ít nhất là 10,000đ'
      )
      setLoading(false)
      return
    }
    form_data = {
      numberResource,
      numberReceiver: numberReceiver || newNumberReceiver,
      amount,
      isSenderPaidFee: !!isSenderPaidFee,
      message: message || '',
      email,
    }
    const otp = await REST_API.getCode(email)
    if (otp && otp.success) {
      openNotification(
        'Thông báo từ hệ thống',
        'Đã gửi mã OTP về email cá nhân!'
      )
      setLoading(false)
      setCurrentProgress(1)
    } else {
      openNotification('Thông báo từ hệ thống', 'Lỗi khi gửi OTP!')
      return
    }
  }
  const transfer = async (otp) => {
    if (isNaN(otp)) {
      openNotification('Thông báo từ hệ thống', 'Mã OTP không hợp lệ!')
      return
    }
    form_data.code = otp
    const data = await REST_API.internalTransfer(form_data)
    if (data && data.success) {
      openNotification('Thông báo từ hệ thống', 'Chuyển khoản thành công!')
      form.resetFields()
      setIsDone(true)
      setCurrentProgress(2)
    } else {
      openNotification(
        'Thông báo từ hệ thống',
        data.message || 'Mã OTP không hợp lệ!'
      )
      return
    }
  }
  const resendOTP = async () => {
    const otp = await REST_API.getCode(email)
    if (otp && otp.success) {
      openNotification(
        'Thông báo từ hệ thống',
        'Đã gửi mã OTP về email cá nhân!'
      )
    } else {
      openNotification('Thông báo từ hệ thống', 'Lỗi khi gửi OTP!')
      return
    }
  }
  const confirm = async () => {
    if (isNewReceiver) {
      const { name, number, bank_name } = newAccountReceiver
      const dataInput = {
        reminiscent_name: name,
        number,
        bank_name: bank_name.toUpperCase(),
      }
      const data = await REST_API.addReceiver(dataInput)
      if (data && data.success) {
        message.info('Đã lưu!')
      } else {
        openNotification(
          'Thông báo từ hệ thống',
          'Có lỗi, Chưa lưu người nhận!'
        )
        return
      }
    }
    props.history.push('/')
  }
  //
  return (
    <div className='transfer_frame'>
      <div className='transfer_main'>
        <Steps direction='vertical' current={currentProgress}>
          <Step
            title={
              <div
                style={{
                  width: '71vw',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h3>Nhập thông tin</h3>
                <h4 style={{ color: 'rgb(24, 144, 255)' }}>
                  <b>Chuyển khoản nội bộ</b>
                </h4>
              </div>
            }
            description={
              currentProgress === 0 ? (
                <div className='form_info'>
                  <Form {...layout} name='transfer-form' form={form}>
                    <Form.Item
                      name='numberResource'
                      label={<b>Tài khoản nguồn</b>}
                    >
                      <AccountSelect arr={listAccount} />
                    </Form.Item>
                    <Divider />
                    <Form.Item label={<b>Tài khoản nhận</b>}>
                      <Row className='receiver-item'>
                        <Col span={8}>
                          <Form.Item name='receiverOption'>
                            <ReceiverOption />
                          </Form.Item>
                        </Col>
                        <Col span={optionReceiver ? 16 : 15}>
                          {optionReceiver ? (
                            <Form.Item
                              name='numberReceiver'
                              hasFeedback
                              validateStatus={validateStatus}
                            >
                              <AccountReceiver arr={listAccountReceiver} />
                            </Form.Item>
                          ) : (
                            <Form.Item
                              name='newNumberReceiver'
                              hasFeedback
                              validateStatus={validateStatus}
                            >
                              <InputNumber
                                type='number'
                                min={1}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          )}
                        </Col>
                        {!optionReceiver && (
                          <Col span={1} className='search-button'>
                            <Form.Item>
                              <Tooltip title='search'>
                                <Button
                                  htmlType='button'
                                  onClick={confirmReceiver}
                                  icon={<SearchOutlined />}
                                />
                              </Tooltip>
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    </Form.Item>
                    <Divider />
                    <Form.Item name='amount' label={<b>Số tiền</b>}>
                      <Input
                        type='number'
                        min={10000}
                        step={10000}
                        suffix={<b>| VND</b>}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                      name='isSenderPaidFee'
                      label={<b>Thanh toán phí</b>}
                    >
                      <Radio.Group defaultValue={'isReceiverPaid'}>
                        <Radio value='isSenderPaid'>Người gửi trả phí</Radio>
                        <Radio value='isReceiverPaid'>Người nhận trả phí</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item name='message' label={<b>Lời nhắn</b>}>
                      <Input.TextArea />
                    </Form.Item>
                    <Divider />

                    <Form.Item
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Button
                        style={{
                          margin: 'auto',
                          width: '10vw',
                          display: 'block',
                        }}
                        type='primary'
                        htmlType='button'
                        onClick={() => {
                          checkForm()
                        }}
                        loading={loading}
                      >
                        Tiếp tục
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : isDone ? (
                <div></div>
              ) : (
                <Button
                  type='dashed'
                  htmlType='button'
                  onClick={() => {
                    setCurrentProgress(0)
                  }}
                >
                  Cập nhật
                </Button>
              )
            }
          />
          <Step
            title='Xác thực OTP'
            description={
              currentProgress === 1 && (
                <OtpConfirm resendOTP={resendOTP} transfer={transfer} />
              )
            }
          />
          <Step
            title='Hoàn thành'
            description={
              !isDone ? (
                <div></div>
              ) : (
                <div>
                  <Text>Chuyển khoản thành công!</Text>
                  <Button
                    style={{
                      margin: 'auto',
                      display: 'block',
                    }}
                    type='primary'
                    htmlType='button'
                    loading={loading}
                    onClick={confirm}
                  >
                    {isNewReceiver
                      ? 'Lưu người nhận cho lần kế tiếp'
                      : 'Hoàn tất'}
                  </Button>
                </div>
              )
            }
          />
        </Steps>
      </div>
    </div>
  )
}

export default InterbankTransfer
