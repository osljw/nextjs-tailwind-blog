import { apiUrl, isValidToken } from './config'
import service from './config'

export async function borrow(bookIds) {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/books/borrow`, { bookIds })

  console.log('borrow res==', res)
  return res
}

export async function get_all_book(titleQuery = '') {
  const params = new URLSearchParams()
  if (titleQuery) {
    params.append('title', titleQuery) // 假设按照书名进行搜索，将搜索关键字添加到查询参数中，名为title
  }

  // 向后端发送登录请求
  const res = await service.get(`${apiUrl}/books`, { params })

  console.log('get_all_book res==', res)
  return res
}
