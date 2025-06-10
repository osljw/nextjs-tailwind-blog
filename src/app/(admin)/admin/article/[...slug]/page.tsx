'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Form, Select } from 'antd'
import { Button, Radio, Input, Breadcrumb } from 'antd'
import { message } from 'antd'

import TinymceEditor from '@/editor/TinymceEditor'
// import MonacoEditor from '@/editor/MonacoEditor'
import MDXEditor from '@/editor/MDXEditor'

import { getArticle, postArticle, putArticle, deleteArticle } from '@/lib/api/article'
import { getArticleCategoryList } from '@/lib/api/category'

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
  const [categoryOptions, setCategoryOptions] = useState([])
  const [categories, setCategories] = useState([])
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (!createMode) {
      // 获取编辑文章数据
      getArticle(slug).then((value) => {
        setPost(value)
        setContent(value.body)
        setCategories(value.categories)
        form.setFieldsValue({
          title: value.title,
          type: value.type,
        })
      })

      getArticleCategoryList().then((data) => {
        setCategoryOptions(data)
      })
    } else {
      // 创建新的文章
      getArticleCategoryList().then((data) => {
        setCategoryOptions(data)
      })
    }
  }, [createMode, slug, form])

  useEffect(() => {
    if (categoryOptions.length > 0 && post.categories) {
      form.setFieldsValue({
        categories: post.categories.map((c) => c.id),
      })
    }
  }, [categoryOptions, post.categories]) // 依赖数据变化

  const updateArticle = async (values) => {
    if (isSubmitting) {
      // 请求正在进行中，不执行重复操作
      return
    }

    console.log('put values:', values)

    setIsSubmitting(true)

    try {
      const response = await putArticle({
        id: slug,
        title: values.title,
        body: content,
        type: values.type,
        categories: values.categories,
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
        categories: values.categories,
        type: values.type,
        // auth: {
        //   // id: 1,
        //   username: 'admin',
        // },
      })
      console.log('createArticle response:', response)

      if (response.id) {
        console.log('文章创建成功！')
        messageApi.open({
          type: 'success',
          content: '文章创建成功！',
        })
        router.push(`/admin/article/${response.id}`)
      } else {
        console.error('文章创建失败！')
        messageApi.open({
          type: 'error',
          content: '文章创建失败！',
        })
      }
    } catch (error) {
      console.error('文章创建发生错误：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onFinish = async (values) => {
    const allValues = form.getFieldsValue(true)
    console.log('form values:', values, allValues)
    if (createMode) {
      createArticle(values)
    } else {
      updateArticle(values)
    }
  }

  const onDelete = () => {
    deleteArticle(slug).then((res) => {
      console.log('delete res:', res)
      if (res.status === 204) {
        router.push('/admin/article')
      }
    })
  }

  console.log(
    'article slug:',
    params.slug,
    ' post:',
    post,
    ' categoryOptions:',
    categoryOptions,
    ' category:',
    categories
  )
  //   console.log('content:', content)

  const handleTypeChange = (event) => {
    const newValue = event.target.value
    console.log('handleTypeChange:', newValue)

    // 更新 post 对象中的 type 属性
    setPost((prevPost) => ({
      ...prevPost,
      type: newValue,
    }))
  }

  const renderEditor = () => {
    console.log('renderEditor post.type:', post.type)
    if (post.type === 'html') {
      return <TinymceEditor initialValue={post.body} setContent={setContent} readOnly={false} />
    } else if (post.type === 'mdx') {
      return <MDXEditor initialValue={post.body} setContent={setContent} readOnly={false} />
    } else if (post.type === 'external') {
      return (
        <div className="p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">请输入外链地址：</label>
          <Input
            placeholder="https://example.com"
            defaultValue={post.body}
            onChange={(e) => setContent(e.target.value)}
            className="w-full"
          />
        </div>
      )
    }

    return null
  }

  console.log('======post:', post)

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
        validateMessages={validateMessages}
        initialValues={{
          type: post.type,
          categories: post.categories?.map((c) => c.id),
        }}
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

        <Form.Item
          name="categories"
          label="文章分类"
          rules={[{ required: true, message: '请至少选择一个分类' }]}
        >
          <Select
            mode="multiple"
            placeholder="选择分类"
            options={categoryOptions} // 从接口获取的分类数据
            fieldNames={{ label: 'name', value: 'id' }}
            optionFilterProp="name"
            showSearch
          />
        </Form.Item>

        <Form.Item name={['type']} label="文章类型">
          <Radio.Group value={post.type} buttonStyle="solid" onChange={handleTypeChange}>
            <Radio.Button value="mdx">MDX</Radio.Button>
            <Radio.Button value="html">HTML</Radio.Button>
            <Radio.Button value="external">外链</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="文章内容">{renderEditor()}</Form.Item>

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
