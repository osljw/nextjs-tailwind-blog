'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Space, Table, Card, Pagination, Spin, Input, Select } from 'antd'
import { CaretUpOutlined, CaretDownOutlined, CalendarOutlined } from '@ant-design/icons'

import { getArticleList } from '@/lib/api/article'
import SortArrows from '@/components/SortArrows'

const { Search } = Input

const CollectionList = () => {
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
      render: (text, record) => (
        <Link
          href={`/article/${record.id}`}
          className="text-blue-600 hover:text-blue-800"
          // 可添加预加载行为
          prefetch={false}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: true,
      render: (text) => new Date(text).toLocaleString(),
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: () => <a>查看详情</a>,
    // },
  ]

  useEffect(() => {
    const fetchData = async (params = {}) => {
      setLoading(true)
      try {
        const response = await getArticleList({
          page: pagination.current,
          page_size: pagination.pageSize,
          ordering,
          search: searchText,
          ...params,
        })

        console.log('fetchData:', response)

        setData(response.results)
        setPagination({
          ...pagination,
          total: response.count,
        })
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

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
          defaultValue="-create_time"
          onChange={(value) => setOrdering(value)}
          className="min-w-[120px]"
          options={[
            { value: '-create_time', label: '最新创建' },
            { value: 'create_time', label: '最早创建' },
            // { value: '-rating', label: '评分最高' },
            // { value: 'rating', label: '评分最低' },
          ]}
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
        <div className="flex min-h-[calc(100vh-100px)] flex-col ">
          <div className="grid flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((record) => (
              <Card
                key={record.id}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white"
                style={{ height: '150px', display: 'block' }}
              >
                <div className="content-wrapper min-w-[300px]">
                  <Link
                    href={`/article/${record.id}`}
                    className="text-blue-600 hover:text-blue-800"
                    // 可添加预加载行为
                    prefetch={false}
                  >
                    {record.title}
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarOutlined className="mr-2" />
                    <time>{new Date(record.create_time).toLocaleString()}</time>
                  </div>
                </div>

                {/* 悬停装饰层 */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 transition-opacity group-hover:opacity-20"
                  style={{ pointerEvents: 'none' }}
                />
              </Card>
            ))}
          </div>

          <div className="sticky bottom-0 mt-4 flex justify-center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default CollectionList
