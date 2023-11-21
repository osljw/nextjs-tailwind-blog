'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Table, Tag, Button, Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
// import { getArticleList } from '@/lib/backend'

export async function getArticleList() {
  const res = await fetch(`http://127.0.0.1:8000/api/article`, {
    // method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  // slug, date, title, summary, tags, images
  // const posts = transformData(await res.json())
  const posts = await res.json()

  return posts
}

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   key: "id",
  // },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'name',
    render: (title, record) => {
      console.log('title', title)
      return (
        <>
          <Link href={`/admin/article/${record.id}`}>{title}</Link>
        </>
      )
    },
  },
  // {
  //   title: "url",
  //   dataIndex: "url",
  //   key: "url",
  // },
  {
    title: 'Tags',
    dataIndex: 'tags',
    render: (tags) => (
      <>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </>
    ),
  },
  {
    title: 'Actions',
    render: () => (
      <>
        <Button type="link" icon="edit" />
        <Button type="link" icon="delete" />
      </>
    ),
  },
]

export default function Page() {
  // const res = await fetch(`http://127.0.0.1:8000/api/article`, {
  //     // method: 'GET',
  //     headers: {
  //         Accept: 'application/json',
  //     },
  // })
  // const posts = await res.json()

  const [posts, setPosts] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData:')
      // const res = await fetch(`http://127.0.0.1:8000/api/article`, {
      //     // method: 'GET',
      //     headers: {
      //         Accept: 'application/json',
      //     },
      // })

      // setPosts(await res.json())
      setPosts(await getArticleList())
    }

    fetchData()
  }, [])

  //
  console.log('admin article posts:', posts)

  const createArticle = () => {
    router.push('/admin/article/create')
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Home',
          },
          {
            title: <Link href="">Article</Link>,
          },
        ]}
      />
      <h2> article list page </h2>

      {/* <Link href="/admin/article/create" passHref={true}></Link> */}

      <Button type="primary" onClick={createArticle}>
        {' '}
        新增文章{' '}
      </Button>
      <>
        <Table rowKey={(record) => record.title} columns={columns} dataSource={posts} />
      </>
    </>
  )
}
