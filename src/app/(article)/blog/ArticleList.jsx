import React, { useState, useEffect } from 'react'
import { Table, Pagination, Spin, Input, Select } from 'antd'
import axios from 'axios'

const { Search } = Input

const ArticleList = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [ordering, setOrdering] = useState('-create_time')
  const [searchText, setSearchText] = useState('')

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: true,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: () => <a>查看详情</a>,
    },
  ]

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const response = await axios.get('/api/articles/', {
        params: {
          page: pagination.current,
          page_size: pagination.pageSize,
          ordering,
          search: searchText,
          ...params,
        },
      })

      setData(response.data.results)
      setPagination({
        ...pagination,
        total: response.data.count,
      })
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize, ordering, searchText])

  const handleTableChange = (pagination, filters, sorter) => {
    const order = sorter.field
      ? `${sorter.order === 'descend' ? '-' : ''}${sorter.field}`
      : '-create_time'
    setOrdering(order)
  }

  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    })
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-4 flex gap-4">
        <Search
          placeholder="搜索文章"
          className="flex-1"
          onSearch={(value) => setSearchText(value)}
          enterButton
        />
        <Select
          defaultValue="10"
          onChange={(value) => setPagination((prev) => ({ ...prev, pageSize: value }))}
          className="w-24"
        >
          <Select.Option value="10">10条/页</Select.Option>
          <Select.Option value="20">20条/页</Select.Option>
          <Select.Option value="50">50条/页</Select.Option>
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          onChange={handleTableChange}
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={false}
            onChange={handlePaginationChange}
            className="ant-pagination"
          />
        </div>
      </Spin>
    </div>
  )
}

export default ArticleList
