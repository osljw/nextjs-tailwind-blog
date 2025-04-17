'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Table, DatePicker, Button } from 'antd'

import LoginModal from '@/components/user/LoginModal'
import { borrow, get_all_book } from '@/lib/api/book'
import { login } from '@/lib/api/login'
import { error } from 'console'

const AllBooksTable = (props) => {
  const [allBook, setAllBook] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

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
        if (data && data.status === 401) {
          setIsModalVisible(true)
          return
        }
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
        if (error.response.status === 401) {
          setIsModalVisible(true)
        }
      })
  }

  const handleLogin = (values) => {
    // 向后端发送登录请求
    login({
      username: values.username,
      password: values.password,
    })
      .then((response) => {
        // 处理登录成功后的逻辑，例如保存 token 到本地存储
        console.log('登录成功', response)
        localStorage.setItem('token', response.access)

        setIsModalVisible(false)

        // onLoginSuccess();
        // form.resetFields();
        // setLoading(false);
        return true
      })
      .catch((error) => {
        return false
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
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

      <LoginModal visible={isModalVisible} onLogin={handleLogin} onCancel={handleCancel} />
    </div>
  )
}

export default AllBooksTable
