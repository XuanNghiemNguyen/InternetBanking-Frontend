import { notification } from 'antd'
import { REST_API } from '../../config/api'

const validateNumber = async (bank_name, number) => {
	let data = null
	switch (bank_name.toUpperCase()) {
		case 'SACOMBANK':
			data = await REST_API.getOtherInfo(number)
			if (data && data.success) {
				return data.user
			} else {
				console.log(data)
				return false
			}
		case 'HHBANK':
			data = await REST_API.getUserInfoFromHHBank(number)
			console.log('hhbank', data)
			if (data && data.success) {
				console.log(data)
				return data.user
			} else {
				return false
			}
		case 'AGRIBANK':
			data = await REST_API.getUserInfoFromTeam29(number)
			console.log('Agribank:', data)
			if (data && data.success) {
				console.log(data)
				return data.user
			} else {
				return false
			}
		default:
			return false
	}
}
const openNotification = (message, description, time) => {
	notification.info({
		message,
		description,
		placement: 'bottomLeft',
		duration: time || 3
	})
}
export { validateNumber, openNotification }
