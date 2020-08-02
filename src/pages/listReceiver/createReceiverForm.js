import React, { useRef, useState } from 'react'
import { Form, Input, Select, Modal, Button, Divider, Row, Col } from 'antd'
import { validateNumber, openNotification } from '../common/index'

const { Option } = Select
const layout = {
	labelCol: {
		span: 8
	},
	wrapperCol: {
		span: 16
	}
}

let onProcess = false

const CreateReceiverForm = (props) => {
	const [form] = Form.useForm()
	const { modalVisiable, setModalVisiable, addReceiver, dataReceiver } = props
	const [loading, setLoading] = useState(false)
	const formRef = useRef()

	const handleCancel = () => {
		setModalVisiable(false)
	}
	const onFinish = async (values) => {
		try {
			if (!!onProcess) return
			onProcess = true
			setLoading(true)
			let { newReceiver_bank, newReceiver_number, newReceiver_name } = values
			if (
				dataReceiver
					.filter(
						(i) => i.bank_name.toLowerCase() === newReceiver_bank.toLowerCase()
					)
					.some((item) => item.number === newReceiver_number)
			) {
				setModalVisiable(false)
				onProcess = false
				setLoading(false)
				openNotification(
					`Có lỗi khi thêm!`,
					'Số tài khoản này đã tồn tại trong danh sách người nhận'
				)
				return
			}
			const user = await validateNumber(newReceiver_bank, newReceiver_number)
			if (user) {
				if (!newReceiver_name || newReceiver_name === '') {
					values.newReceiver_name = user.name
				}

				const { message } = addReceiver(values)
				setModalVisiable(false)
				openNotification(message)
			} else {
				setModalVisiable(false)
				onProcess = false
				setLoading(false)
				openNotification(
					`Số tài khoản không tồn tại!`,
					`Thông báo từ ${newReceiver_bank.toUpperCase()}`
				)
			}
			form.resetFields()
		} catch (error) {
			console.log(error)
			setModalVisiable(false)
			onProcess = false
			setLoading(false)
			openNotification('Có lỗi khi thêm!', 'Thông báo từ hệ thống')
			form.resetFields()
		}
		onProcess = false
		setLoading(false)
	}
	const onFinishFailed = (errorInfo) => {
		console.log(errorInfo)
	}
	return (
		<Modal
			name='control-ref'
			visible={modalVisiable}
			title='Người nhận mới'
			footer={null}
			onCancel={handleCancel}
		>
			<Form
				{...layout}
				ref={formRef}
				name='control-ref'
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				form={form}
			>
				<Form.Item
					name='newReceiver_bank'
					label='Tên ngân hàng'
					rules={[
						{
							required: true,
							message: 'Chọn ngân hàng người nhận'
						}
					]}
				>
					<Select placeholder='Chọn ngân hàng' allowClear>
						<Option value='sacombank'>SACOMBANK</Option>
						<Option value='hhbank'>HHBANK</Option>
						<Option value='agribank'>AGRIBANK</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='newReceiver_number'
					label='Số tài khoản'
					rules={[
						{
							required: true,
							message: 'Nhập số tài khoản người nhận'
						}
					]}
				>
					<Input type='number' />
				</Form.Item>
				<Form.Item name='newReceiver_name' label='Tên gợi nhớ'>
					<Input />
				</Form.Item>
				<Divider dashed />
				<Row>
					<Col span={24} style={{ textAlign: 'right' }}>
						<Form.Item style={{ margin: -10, justifyContent: 'flex-end' }}>
							<Button
								type='ghost'
								style={{ marginRight: 10 }}
								onClick={handleCancel}
							>
								Hủy
							</Button>
							<Button htmlType='submit' loading={loading} type='primary'>
								Xác nhận
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default CreateReceiverForm
