'use client'
import React from 'react'
import { Table } from 'antd'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '书籍标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
  },
]

const ToBorrowTable = (props) => {
  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={props.data} // 接收外部传入的待借阅书籍数据
    />
  )
}

export default ToBorrowTable
