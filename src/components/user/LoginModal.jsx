import React, { useState } from 'react'
import { Modal, Button, Form, Input } from 'antd'

const { Item } = Form

const LoginModal = ({ onLogin, visible, onCancel }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 模拟登录函数，实际中应该替换为真实的后端登录逻辑，比如发送POST请求到登录接口等
  const handleLogin = async (values) => {
    setLoading(true)

    if (onLogin(values)) {
      // onLoginSuccess();
      form.resetFields()
      setLoading(false)
    } else {
      form.setFields([
        {
          name: 'username',
          value: values.username,
          errors: ['用户名或密码错误'],
        },
        {
          name: 'password',
          value: values.password,
          errors: ['用户名或密码错误'],
        },
      ])
      setLoading(false)
    }

    // // 这里简单模拟登录成功，实际要根据后端返回的结果判断
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // if (values.username === 'test' && values.password === '123456') {
    //     onLoginSuccess();
    //     form.resetFields();
    //     setLoading(false);
    // } else {
    //     form.setFields([
    //         {
    //             name: 'username',
    //             value: values.username,
    //             errors: ['用户名或密码错误'],
    //         },
    //         {
    //             name: 'password',
    //             value: values.password,
    //             errors: ['用户名或密码错误'],
    //         },
    //     ]);
    //     setLoading(false);
    // }
  }

  return (
    <Modal
      title="登录"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          form="loginForm"
          htmlFor="submit"
          onClick={() => form.submit()}
        >
          登录
        </Button>,
      ]}
    >
      <Form id="loginForm" form={form} onFinish={handleLogin}>
        <Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Item>
        <Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            // {
            //     min: 6,
            //     message: '密码长度至少为6位',
            // },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Item>
      </Form>
    </Modal>
  )
}

export default LoginModal
