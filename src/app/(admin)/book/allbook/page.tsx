import React from 'react'
import { Table, DatePicker } from 'antd'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '书名',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '借阅日期',
    dataIndex: 'url',
    key: 'url',
    render: (url, record) => {
      return (
        <>
          <DatePicker onChange={onChange} />
        </>
      )
    },
  },
  {
    title: '归还日期',
    dataIndex: 'valid',
    render: (_, record) => (
      // <Switch defaultChecked={record.valid} onChange={handleSwitchChange(record.id)} />
      <DatePicker onChange={onChange} />
    ),
  },
  {
    title: '备注',
    dataIndex: 'title',
    key: 'title',
  },
]

const AllBooksTable = (props) => {
  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={props.data} // 接收外部传入的全部书籍数据
    />
  )
}

export default AllBooksTable
