'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Button, Input, Breadcrumb } from 'antd'
import { message } from 'antd'

import TinymceEditor from '@/editor/TinymceEditor'

import { getArticle, postArticle, putArticle, deleteArticle } from '@/lib/api'

const layout = {
  labelCol: {
    span: 1,
  },
  // wrapperCol: {
  //   span: 16,
  // },
}

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}
/* eslint-enable no-template-curly-in-string */

export default function Page({ params }) {
  const router = useRouter()
  const [post, setPost] = useState({})
  const [content, setContent] = useState('')
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const slug = params.slug.join('')
  const createMode = slug === 'create'

  useEffect(() => {
    if (!createMode) {
      getArticle(slug).then((value) => {
        setPost(value)
        setContent(value.body)
        form.setFieldsValue({
          title: value.title,
        })
      })
    }
  }, [createMode, slug, form])

  const updateArticle = async (values) => {
    if (isSubmitting) {
      // 请求正在进行中，不执行重复操作
      return
    }

    setIsSubmitting(true)

    try {
      const response = await putArticle({
        id: slug,
        title: values.title,
        body: content,
        //   is_show: false,
        // tags: ["tag1", "tag2"],
        // auth: 1,
        tags: ['tag1', 'tag2'],
        auth: {
          username: 'admin',
        },
      })
      console.log('putArticle response:', response)

      if (response.id) {
        console.log('文章更新成功！')
        messageApi.open({
          type: 'success',
          content: '文章更新成功！',
        })
      } else {
        console.error('文章更新失败！')
        messageApi.open({
          type: 'error',
          content: '文章更新失败！',
        })
      }
    } catch (error) {
      console.error('文章更新发生错误：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const createArticle = async (values) => {
    console.log('createArticle form values:', values)

    if (isSubmitting) {
      // 请求正在进行中，不执行重复操作
      return
    }

    setIsSubmitting(true)

    try {
      const response = await postArticle({
        title: values.title,
        body: content,
        //   is_show: false,
        // tags: ["tag1", "tag2"],
        // auth: 1,
        tags: ['tag1', 'tag2'],
        auth: {
          // id: 1,
          username: 'admin',
        },
      })
      console.log('createArticle response:', response)

      if (response.id) {
        console.log('文章创建成功！')
        messageApi.open({
          type: 'success',
          content: '文章创建成功！',
        })
      } else {
        console.error('文章创建失败！')
      }
    } catch (error) {
      console.error('文章创建发生错误：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onFinish = async (values) => {
    console.log('form values:', values)
    if (createMode) {
      createArticle(values)
    } else {
      updateArticle(values)
    }
  }

  const onDelete = () => {
    deleteArticle(slug).then((res) => {
      console.log('delete res:', res)
      router.push('/admin/article')
    })
  }

  console.log('article slug:', params.slug, ' post:', post)
  //   console.log('content:', content)
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Home',
          },
          {
            title: <Link href="/admin/article">Article</Link>,
          },
          //   {
          //     title: <a href="">Application List</a>,
          //   },
          {
            title: params.slug,
          },
        ]}
      />
      {/* <h2> article slug: {params.slug} </h2> */}
      {/* <TinymceEditor initialValue={post && post.body} readOnly={true} /> */}
      {/* <Button type='primary' onClick={updateArticle}> 更新 </Button>
          <TinymceEditor initialValue={post && post.body} setContent={setContent} /> */}

      <Form
        form={form}
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        // style={{
        //     maxWidth: 600,
        // }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={['title']}
          label="标题"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input value={post.title} />
        </Form.Item>
        {/* <Form.Item
                    name={['user', 'email']}
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'age']}
                    label="Age"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99,
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item> */}
        <Form.Item label="文章内容">
          {createMode ? (
            <TinymceEditor initialValue="" setContent={setContent} />
          ) : (
            <TinymceEditor initialValue={post && post.body} setContent={setContent} />
          )}
        </Form.Item>
        {/* <Form.Item name={['user', 'introduction']} label="Introduction">
                    <Input.TextArea />
                </Form.Item> */}
        <Form.Item
          wrapperCol={{
            // ...layout.wrapperCol,
            offset: 2,
          }}
        >
          {contextHolder}
          {!createMode && (
            <Button type="primary" danger onClick={onDelete}>
              删除
            </Button>
          )}
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '保存'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
