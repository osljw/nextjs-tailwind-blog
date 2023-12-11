import { apiUrl } from './config'
import service from './config'

export async function login(data) {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/login`, data)

  return res
}
