import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css'
import './index.css'
import {
	Table,
	Input,
	Tag,
	Space,
	Form,
	Button,
	Popconfirm,
	message
} from 'antd'
import Highlighter from 'react-highlight-words'
import {
	SearchOutlined,
	SaveOutlined,
	UserAddOutlined
} from '@ant-design/icons'
import CreateRecceiverForm from './createReceiverForm'
import { REST_API } from '../../config/api'
import { validateNumber, openNotification } from '../common/index'

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <Input type='number' /> : <Input />
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0
					}}
					rules={[
						{
							required: true,
							message: `Hãy nhập ${title}!`
						}
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	)
}

const ListReceiver = () => {
	const [form] = Form.useForm()
	const [data, setData] = useState([])
	const [currentBank, setCurrentBank] = useState('sacombank')
	const [currentNumber, setCurrentNumber] = useState(1)
	const [modalVisiable, setModalVisiable] = useState(false)
	const [editingKey, setEditingKey] = useState('')
	const [searchText, setSearchText] = useState('')
	const [searchedColumn, setSearchedColumn] = useState(null)
	let searchInput = useRef('')
	useEffect(() => {
		const getReceivers = async () => {
			const _data = await REST_API.getReceivers()
			if (_data && _data.receivers && _data.receivers.length > 0) {
				setData(
					_data.receivers.map((item, index) => ({
						key: index.toString(),
						index: index + 1,
						reminiscent_name: item.reminiscent_name,
						number: item.number,
						bank_name: item.bank_name.toUpperCase()
					}))
				)
			}
		}
		getReceivers()
	}, [])
	const isEditing = (record) => record.key === editingKey
	const addReceiver = ({
		newReceiver_bank,
		newReceiver_number,
		newReceiver_name
	}) => {
		setData([
			...data,
			{
				key: (data.length + 1).toString(),
				index: data.length + 1,
				reminiscent_name: newReceiver_name,
				number: newReceiver_number,
				bank_name: newReceiver_bank.toUpperCase()
			}
		])
		return {
			success: true,
			message: 'Thêm mới thành công'
		}
	}
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						searchInput = node
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type='primary'
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size='small'
						style={{ width: 90 }}
					>
						Tìm
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size='small'
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.select())
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
				text
			)
	})

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm()
		setSearchText(selectedKeys[0])
		setSearchedColumn(dataIndex)
	}

	const handleReset = (clearFilters) => {
		clearFilters()
		setSearchText('')
	}

	const edit = (record) => {
		const { bank_name, number, reminiscent_name } = record
		form.setFieldsValue({
			reminiscent_name,
			number
		})
		setCurrentBank(bank_name)
		setCurrentNumber(number)
		setEditingKey(record.key)
	}

	const cancel = () => {
		setEditingKey('')
	}

	const save = async (key) => {
		try {
			const row = await form.validateFields()
			const newData = [...data]
			const index = newData.findIndex((item) => key === item.key)
			if (index > -1) {
				const idx = data.findIndex(
					(i) => parseInt(i.number) === parseInt(row.number)
				)
				if (
					currentNumber !== row.number &&
					idx > -1 &&
					currentBank === data[idx].bank_name
				) {
					openNotification(
						'Có lỗi khi thêm!',
						`Số tài khoản này đã tồn tại với tên gợi nhớ ${data[idx].reminiscent_name}!`
					)
					setEditingKey('')
					return
				}
				const user = await validateNumber(currentBank, row.number)
				if (user) {
					if (!row.reminiscent_name || row.reminiscent_name === '') {
						row.reminiscent_name = user.name
					}
					const item = newData[index]
					newData.splice(index, 1, { ...item, ...row })
					setData(newData)
					setEditingKey('')
				} else {
					openNotification(
						'Sô tài khoản này không tồn tại trong ngân hàng!',
						`Thông báo từ ${currentBank}`
					)
				}
			} else {
				setEditingKey('')
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo)
		}
	}

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: '10%',
			editable: false
		},
		{
			title: 'Tên gợi nhớ',
			dataIndex: 'reminiscent_name',
			width: '25%',
			editable: true,
			...getColumnSearchProps('reminiscent_name')
		},
		{
			title: 'Số tài khoản',
			dataIndex: 'number',
			width: '25%',
			editable: true,
			...getColumnSearchProps('number')
		},
		{
			title: 'Tên ngân hàng',
			dataIndex: 'bank_name',
			width: '20%',
			editable: false,
			render: (bank_name) => (
				<>
					<Tag
						color={(() => {
							switch (bank_name.toUpperCase()) {
								case 'SACOMBANK':
									return 'green'
								case 'HHBANK':
									return 'blue'
								case 'TEAM29':
									return 'orange'
								default:
									return 'red'
							}
						})()}
						key={bank_name}
					>
						{bank_name}
					</Tag>
				</>
			)
		},
		{
			title: 'Tùy chọn',
			dataIndex: 'operation',
			render: (_, record) => {
				const editable = isEditing(record)
				return editable ? (
					<span>
						<Button
							onClick={() => save(record.key)}
							style={{
								marginRight: 8
							}}
						>
							Lưu
						</Button>
						<Button onClick={cancel}>Hủy</Button>
					</span>
				) : (
					<span>
						<Button
							style={{ marginRight: 10 }}
							disabled={editingKey !== ''}
							onClick={() => edit(record)}
						>
							Sửa
						</Button>

						<Popconfirm
							placement='bottomRight'
							title='Bạn chắc chắn muốn xóa người nhận này?'
							onConfirm={() => removeReceiver(record)}
							okText='Có'
							cancelText='Không'
						>
							<Button danger disabled={editingKey !== ''}>
								Xóa
							</Button>
						</Popconfirm>
					</span>
				)
			}
		}
	]
	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === 'number' ? 'number' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record)
			})
		}
	})

	const saveAllChanges = async () => {
		const recivers =
			data.length > 0
				? data.map((item) => ({
						reminiscent_name: item.reminiscent_name,
						number: parseInt(item.number),
						bank_name: item.bank_name,
						updatedAt: Date.now()
				  }))
				: []
		const res = await REST_API.updateReceivers(recivers)
		console.log(res)
		message.info('Đã lưu!')
	}
	const removeReceiver = async (record) => {
		const idx = data.findIndex((item) => item.number === record.number)
		let newData = [...data]
		newData.splice(idx, 1)
		setData(newData)
	}
	return (
		<div className='listReceiver_frame'>
			<CreateRecceiverForm
				modalVisiable={modalVisiable}
				setModalVisiable={setModalVisiable}
				addReceiver={addReceiver}
				dataReceiver={data}
			/>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<h2>Danh sách người nhận</h2>
				<div>
					<Button
						style={{ marginRight: 10 }}
						icon={<UserAddOutlined />}
						onClick={() => {
							setModalVisiable(true)
						}}
					>
						Thêm mới
					</Button>
					<Popconfirm
						placement='bottomRight'
						title='Bạn muốn lưu lại tất cả thay đổi?'
						onConfirm={saveAllChanges}
						okText='Có'
						cancelText='Không'
					>
						<Button type='primary' icon={<SaveOutlined />}>
							Lưu thay đổi
						</Button>
					</Popconfirm>
				</div>
			</div>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell
						}
					}}
					scroll={{ y: '80vh' }}
					bordered
					dataSource={data}
					columns={mergedColumns}
					rowClassName='editable-row'
					pagination={{
						onChange: cancel
					}}
				/>
			</Form>
		</div>
	)
}

export default ListReceiver
