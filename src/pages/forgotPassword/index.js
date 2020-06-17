import React, { useState } from 'react';
import './index.css';
import { openNotification } from '../common/index';
import { Form, Input, Button } from 'antd';
import { FieldNumberOutlined, LockOutlined } from '@ant-design/icons';
import { REST_API } from '../../config/api';

var onProcess = false;

const ForgotPassword = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();
	const onFinish = async (values) => {
		try {
			if (!!onProcess) return;
			onProcess = true;
			setIsLoading(true);
			const email = localStorage.getItem('email-otp');
			if (!email) {
				openNotification(
					'Lấy mật khẩu thất bại!',
					'Email không khớp, vui lòng lấy lại OTP!'
				);
				onProcess = false;
				setIsLoading(false);
				return;
			}
			const { code, new_password, new_password_confirm } = values;
			if (new_password !== new_password_confirm) {
				openNotification(
					'Lấy mật khẩu thất bại!',
					'Mật khẩu xác nhận không khớp!'
				);
				onProcess = false;
				setIsLoading(false);
				return;
			}
			const data = await REST_API.forgotPassword(email, code, new_password);
			if (data.success) {
				openNotification('Lấy lại mật khẩu thành công!', '');
				localStorage.setItem('codeSent', false);
				localStorage.removeItem('email-otp');
				props.history.push('login');
			} else {
				openNotification('Lấy mật khẩu thất bại!', data.message);
			}
		} catch (error) {
			console.log(error);
			openNotification('Lấy mật khẩu thất bại!', 'Kiểm tra cài đặt mạng');
		}
		setIsLoading(false);
		onProcess = false;
	};

	const onFinishFailed = (errorInfo) => {
		console.log(errorInfo);
	};
	return (
		<div className="forgot-pass_frame">
			<Form
				name="basic"
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				className="forgot-pass_form"
				form={form}
			>
				<h1>
					<b className="title">Lấy lại mật khẩu</b>
				</h1>
				<br />
				<Form.Item
					name="code"
					rules={[{ required: true, message: 'Bạn phải nhập mã OTP!' }]}
				>
					<Input
						prefix={<FieldNumberOutlined className="site-form-item-icon" />}
						type="number"
						placeholder="Nhập mã OTP"
					/>
				</Form.Item>
				<Form.Item
					name="new_password"
					rules={[{ required: true, message: 'Nhập mật khẩu mới!' }]}
				>
					<Input.Password
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item
					name="new_password_confirm"
					rules={[{ required: true, message: 'Nhập lại mật khẩu' }]}
				>
					<Input.Password
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Nhập lại mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="forgot-pass-form-button"
						loading={isLoading}
					>
						Xác nhận
					</Button>
				</Form.Item>
				<div className="forgot-passForm_footer">
					<Button
						type="link"
						onClick={() => {
							if (onProcess) return;
							onProcess = true;
							localStorage.setItem('codeSent', false);
							props.history.push({
								pathname: 'getOTPCode',
								dict: 'forgot-password',
							});
							onProcess = false;
						}}
					>
						Bạn muốn lấy lại mã OTP?
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default ForgotPassword;
