import { apiUrl } from './config'
import service from './config'

export async function login(data) {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/login`, data)

  console.log('res==', res)
  return res
}

export async function register(data) {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/register`, data)

  console.log('res==', res)
  return res
}

export async function refresh_token() {
  // 向后端发送登录请求
  const res = await service.post(`${apiUrl}/token/refresh`, data)

  return res
}
