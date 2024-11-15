import { apiUrl } from './config'
import service from './config'

export async function borrow(data) {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/books/borrow/`, data)

  console.log('borrow res==', res)
  return res
}
