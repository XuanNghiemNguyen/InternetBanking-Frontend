import React from 'react';
import { Menu, Input, Avatar, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import {
	ProfileOutlined,
	LogoutOutlined,
	UserSwitchOutlined,
} from '@ant-design/icons';
const { Search } = Input;
const { Item } = Menu;

let onProcess = false;
const RightMenu = (props) => {
	const currentUser = JSON.parse(localStorage.getItem('user-info'));
	const handleMenuClick = (e) => {
		switch (+e.key) {
			case 1:
				break;
			case 2:
				if (!!onProcess) return;
				onProcess = true;
				props.history.push('/change-password');
				onProcess = false;
				break;
			case 3:
				if (!!onProcess) return;
				onProcess = true;
				localStorage.removeItem('access-token');
				localStorage.removeItem('user-info');
				localStorage.setItem('loggedIn', false);
				onProcess = false;
				props.history.push('/login');
				break;
			default:
				break;
		}
	};
	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key="1" icon={<ProfileOutlined />}>
				Quản lý tài khoản
			</Menu.Item>
			<Menu.Item key="2" icon={<UserSwitchOutlined />}>
				Đổi mật khẩu
			</Menu.Item>
			<Menu.Item key="3" icon={<LogoutOutlined />}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);
	return (
		<Menu mode="horizontal">
			<Item style={{ width: 0.3 * window.innerWidth, marginRight: 10 }}>
				<Search
					placeholder="Tìm kiếm..."
					onSearch={(value) => console.log(value)}
				/>
			</Item>
			<span>{currentUser && 'Xin chào, '.concat(currentUser.name)}</span>
			{localStorage.getItem('access-token') ? (
				<Item key="logout">
					<Dropdown overlay={menu}>
						<Avatar
							style={{ backgroundColor: '#87d068' }}
							icon={<UserSwitchOutlined />}
						/>
					</Dropdown>
				</Item>
			) : (
				<Item key="login">
					<Link className="nav-link" to={'/login'}>
						Đăng nhập
					</Link>
				</Item>
			)}
		</Menu>
	);
};
export default withRouter(RightMenu);