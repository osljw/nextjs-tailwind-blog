'use client'

import React, { useState, useEffect } from 'react'
import { Table, Switch, Button, Breadcrumb, Divider, DatePicker, Segmented } from 'antd'

import { borrow } from '@/lib/api/book'
import RequireAuth from '@/components/RequireAuth'

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

const AdminLendBook = () => {
  const [bookIds, setBookIds] = useState('')
  // 用于存储当前选中的Segmented选项
  const [selectedOption, setSelectedOption] = useState('全部书籍')

  // 根据选中的选项切换要展示的表格组件
  const handleSegmentedChange = (value) => {
    setSelectedOption(value)
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books/')
        setBooks(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBooks()
  }, [])

  const handleLend = async () => {
    const bookIdsArray = bookIds.split(',').map(Number)

    borrow({ book_ids: bookIdsArray })
      .then((response) => {
        // 处理登录成功后的逻辑，例如保存 token 到本地存储
        console.log('借阅成功', response)
      })
      .catch((error) => {
        // 处理登录失败的逻辑
        console.error('借阅失败', error)
      })
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Comma - separated Book IDs"
        value={bookIds}
        onChange={(e) => setBookIds(e.target.value)}
      />
      {/* <input type="number" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} /> */}
      <button onClick={handleLend}>Lend Books</button>

      <Segmented options={['全部书籍', '待借阅', '我的借阅']} onChange={handleSegmentedChange} />

      {/* {selectedOption === '全部书籍' && <AllBooksTable data={allBooksData} />} */}
      {/* {selectedOption === '待借阅' && <ToBorrowTable data={toBorrowData} />}
      {selectedOption === '我的借阅' && <MyBorrowTable data={myBorrowData} />} */}
      <Table rowKey={(record) => record.id} columns={columns} dataSource={bookIds} />
    </div>
  )
}

export default RequireAuth(AdminLendBook)
