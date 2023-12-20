'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Button, Radio, Input, Breadcrumb } from 'antd'
import { message } from 'antd'

import TinymceEditor from '@/editor/TinymceEditor'
// import MonacoEditor from '@/editor/MonacoEditor'
import MDXEditor from '@/editor/MDXEditor'

// import { getArticle, postArticle, putArticle, deleteArticle } from '@/lib/api'
import { getPage, postPage, putPage, deletePage } from '@/lib/api/page'

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 20,
  },
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
  const slug = params.slug.join('')
  const createMode = slug === 'create'

  const router = useRouter()
  const [post, setPost] = useState({ type: createMode ? 'mdx' : undefined })
  const [content, setContent] = useState('')
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (!createMode) {
      getPage(slug).then((value) => {
        setPost(value)
        setContent(value.body)
        form.setFieldsValue({
          type: value.type,
          url: value.url,
          title: value.title,
        })
      })
    }
  }, [createMode, slug, form])

  const updatePage = async (values) => {
    if (isSubmitting) {
      // 请求正在进行中，不执行重复操作
      return
    }

    setIsSubmitting(true)

    try {
      const response = await putPage({
        id: slug,
        title: values.title,
        url: values.url,
        type: values.type,
        body: content,
        auth: {
          username: 'admin',
        },
      })
      console.log('putPage response:', response)

      if (response.id) {
        console.log('页面更新成功！')
        messageApi.open({
          type: 'success',
          content: '页面更新成功！',
        })
      } else {
        console.error('页面更新失败！')
        messageApi.open({
          type: 'error',
          content: '页面更新失败！',
        })
      }
    } catch (error) {
      console.error('页面更新发生错误：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const createPage = async (values) => {
    console.log('createPage form values:', values)

    if (isSubmitting) {
      // 请求正在进行中，不执行重复操作
      return
    }

    setIsSubmitting(true)

    // console.log('====== request:', {
    //   body: content,
    //   type: values.type,
    //   auth: {
    //     // id: 1,
    //     username: 'admin',
    //   },
    // })

    try {
      const response = await postPage({
        url: values.url,
        title: values.title,
        body: content,
        type: values.type,
        auth: {
          // id: 1,
          username: 'admin',
        },
      })
      console.log('createPage response:', response)

      if (response.id) {
        console.log('页面创建成功！')
        messageApi.open({
          type: 'success',
          content: '页面创建成功！',
        })
      } else {
        console.error('页面创建失败！')
        messageApi.open({
          type: 'error',
          content: '页面创建失败！',
        })
      }
    } catch (error) {
      console.error('页面创建发生错误：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = () => {
    deletePage(slug).then((res) => {
      console.log('delete res:', res)
      if (res.status === 204) {
        router.push('/admin/page')
      }
    })
  }

  const onFinish = async (values) => {
    const allValues = form.getFieldsValue(true)
    console.log('form values:', values, allValues)
    if (createMode) {
      createPage(values)
    } else {
      updatePage(values)
    }
  }

  console.log('page slug:', params.slug, ' post:', post)
  //   console.log('content:', content)

  const handleTypeChange = (event) => {
    const newValue = event.target.value

    // 更新 post 对象中的 type 属性
    setPost((prevPost) => ({
      ...prevPost,
      type: newValue,
    }))
  }

  const renderEditor = () => {
    if (post.type === 'html') {
      return <TinymceEditor initialValue={post.body} setContent={setContent} />
    } else if (post.type === 'mdx') {
      return <MDXEditor initialValue={post.body} setContent={setContent} />
    }

    return null
  }

  console.log('page ======post:', post)

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Home',
          },
          {
            title: <Link href="/admin/page">页面管理</Link>,
          },
          {
            title: params.slug,
          },
        ]}
      />

      <Form
        form={form}
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        // style={{
        //     maxWidth: 600,
        // }}
        validateMessages={validateMessages}
        initialValues={{
          title: post.title,
          url: post.url,
          type: post.type,
        }}
      >
        <Form.Item
          name={['title']}
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input value={post.title} />
        </Form.Item>
        <Form.Item
          name={['url']}
          label="URL"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input value={post.url} />
        </Form.Item>
        <Form.Item name={['type']} label="页面类型">
          <Radio.Group
            // defaultValue={post.type}
            value={post.type}
            buttonStyle="solid"
            onChange={handleTypeChange}
          >
            <Radio.Button value="mdx">MDX</Radio.Button>
            <Radio.Button value="html">HTML</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="页面内容">{renderEditor()}</Form.Item>

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
