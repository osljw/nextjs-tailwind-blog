'use client'

import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'

import { register } from '@/lib/api/login'

const { Item } = Form
const RegisterPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values) => {
    setLoading(true)
    try {
      // 发送注册请求到Django后端
      const response = await register(values)

      if (response.status_code === 0) {
        // 注册成功后的操作，如跳转到登录页面
        console.log('注册成功')
      } else {
        console.error('注册失败:', response.msg)
      }
    } catch (error) {
      console.error('网络错误:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <Form form={form} name="register-form" onFinish={onFinish}>
        <Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="用户名" />
        </Item>
        <Item
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
        >
          <Input placeholder="邮箱" type="email" />
        </Item>
        <Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input placeholder="密码" type="password" />
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            注册
          </Button>
        </Item>
      </Form>
    </div>
  )
}
export default RegisterPage
