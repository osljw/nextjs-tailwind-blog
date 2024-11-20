'use client'
import '@/css/tailwind.css'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { login } from '@/lib/api/login'

export default function Login() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLoginFormSubmit = (e) => {
    e.preventDefault()

    // 向后端发送登录请求
    login({
      username,
      password,
    })
      .then((response) => {
        // 处理登录成功后的逻辑，例如保存 token 到本地存储
        console.log('登录成功', response)
        localStorage.setItem('token', response.token)
        // router.push('/admin')
        router.back()
      })
      .catch((error) => {
        // 处理登录失败的逻辑
        console.error('登录失败', error)
      })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLoginFormSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
            用户名：
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            密码：
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            登录
          </button>
        </div>
      </form>
    </div>
  )
}
