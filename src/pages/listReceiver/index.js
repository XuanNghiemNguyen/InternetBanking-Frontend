import React, { useState, useRef } from 'react'
import 'antd/dist/antd.css'
import './index.css'
import { Table, Input, InputNumber, Space, Form, Button } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

const originData = []

for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    index: i + 1,
    reminiscent_name: `Edrward ${i}`,
    number: 1612427,
    bank_name: 'SACOMBANK'
  })
}

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
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
              message: `Please Input ${title}!`
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
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState(null)
  let searchInput = useRef('')
  const isEditing = (record) => record.key === editingKey

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
            Search
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
    form.setFieldsValue({
      reminiscent_name: '',
      age: '',
      address: '',
      ...record
    })
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
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
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
      ...getColumnSearchProps('reminiscent_name'),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'number',
      width: '25%',
      editable: true
    },
    {
      title: 'Tên ngân hàng',
      dataIndex: 'bank_name',
      width: '20%',
      editable: false
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
          <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
            Sửa
          </Button>
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
  return (
    <div className='listReceiver_frame'>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
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
