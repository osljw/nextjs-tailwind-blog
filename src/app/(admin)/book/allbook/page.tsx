import React from 'react'
import { useState, useEffect } from 'react'
import { Table, DatePicker, Button } from 'antd'
import { borrow, get_all_book } from '@/lib/api/book'
import { error } from 'console'

const AllBooksTable = (props) => {
  const [allBook, setAllBook] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    get_all_book(searchTerm)
      .then((data) => setAllBook(data))
      .catch((error) => {
        console.error('获取所有书籍数据时出错：', error)
        // 可以根据业务需求在这里进行一些额外的处理，比如设置一个默认的空数据状态，或者提示用户等
        setAllBook([])
      })
  }, [searchTerm])

  const handleSearch = () => {
    get_all_book(searchTerm)
      .then((data) => setAllBook(data))
      .catch((error) => {
        console.error('获取所有书籍数据时出错：', error)
        // 可以根据业务需求在这里进行一些额外的处理，比如设置一个默认的空数据状态，或者提示用户等
        setAllBook([])
      })
  }

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
      title: '总数量',
      dataIndex: 'total_count',
      key: 'total_count',
      // render: (url, record) => {
      //     return (
      //         <>
      //             <DatePicker onChange={onChange} />
      //         </>
      //     )
      // },
    },
    {
      title: '已借数量',
      dataIndex: 'borrowed_count',
      key: 'borrowed_count',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleBorrow(record.id)} // 点击按钮调用借阅操作函数，并传递书籍ID
        >
          借阅
        </Button>
      ),
    },
  ]

  const handleBorrow = async (bookId) => {
    borrow([bookId])
      .then((data) => {
        get_all_book(searchTerm)
          .then((data) => setAllBook(data))
          .catch((error) => {
            console.error('获取所有书籍数据时出错：', error)
            // 可以根据业务需求在这里进行一些额外的处理，比如设置一个默认的空数据状态，或者提示用户等
            setAllBook([])
          })
      })
      .catch((error) => {
        console.error('借阅操作出现错误：', error)
      })
  }

  return (
    <div>
      <input
        type="text"
        placeholder="请输入书名搜索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>搜索</button>
      <Table rowKey={(record) => record.id} columns={columns} dataSource={allBook} />
    </div>
  )
}

export default AllBooksTable
