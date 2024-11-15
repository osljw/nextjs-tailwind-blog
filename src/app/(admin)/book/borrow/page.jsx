'use client'

import React, { useState, useEffect } from 'react'
import { borrow } from '@/lib/api/book'

const AdminLendBook = () => {
  const [bookIds, setBookIds] = useState('')

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
    </div>
  )
}

export default AdminLendBook
