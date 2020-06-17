import { notification } from 'antd';
import { REST_API } from '../../config/api';

const validateNumber = async (bank_name, number) => {
	switch (bank_name.toUpperCase()) {
		case 'SACOMBANK':
			const data = await REST_API.getOtherInfo(number);
			if (data && data.success) {
				return data.user;
			} else {
				console.log(data);
				return false;
			}
		case 'HHBANK':
			return false;
		case 'TEAM29':
			return false;
		default:
			return false;
	}
};
const openNotification = (message, description, time) => {
	notification.info({
		message,
		description,
		placement: 'bottomLeft',
		duration: time || 3,
	});
};
export { validateNumber, openNotification };
