'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Table, Switch, Button, Breadcrumb, Divider } from 'antd'
import { useEffect, useState } from 'react'

import { getPageList, patchPage } from '@/lib/api/page'

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
      setPosts(await getPageList({ valid: 'all' }))
    }

    fetchData()
  }, [])

  //console.log('admin article posts:', posts)

  const createArticle = () => {
    router.push('/admin/page/create')
  }

  const handleSwitchChange = (id) => (checked) => {
    console.log('==switch key:', id, ', checked:', checked)
    // 根据key更新对应行的开关状态
    // const updatedData = posts.map((item) =>
    //   item.id === id ? { ... , switch: checked } : item
    // );
    // setTableData(updatedData);

    // setLoading(true)
    patchPage({ id, valid: checked })
      .then((res) => {
        if (res.id === id) {
          const updatedData = posts.map((item) =>
            item.id === id ? { ...item, valid: checked } : item
          )
          setPosts(updatedData)
        }
      })
      .catch((error) => {
        // 处理异常情况
      })
      .finally(() => {
        // setLoading(false)
      })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url, record) => {
        return (
          <>
            <Link href={`/admin/page/${record.id}`}>{url}</Link>
          </>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'valid',
      render: (_, record) => (
        <Switch defaultChecked={record.valid} onChange={handleSwitchChange(record.id)} />
      ),
    },

    // {
    //   title: 'Tags',
    //   dataIndex: 'tags',
    //   render: (tags) => (
    //     <>
    //       {tags.map((tag) => (
    //         <Tag key={tag}>{tag}</Tag>
    //       ))}
    //     </>
    //   ),
    // },
    // {
    //   title: 'Actions',
    //   render: () => (
    //     <>
    //       <Button type="link" icon="edit" />
    //       <Button type="link" icon="delete" />
    //     </>
    //   ),
    // },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Breadcrumb
            items={[
              {
                title: 'Home',
              },
              {
                title: <Link href="">页面管理</Link>,
              },
            ]}
          />
        </div>

        <div className="flex items-center">
          <Button type="primary" onClick={createArticle}>
            新增页面
          </Button>
        </div>
      </div>

      <Divider />

      <Table rowKey={(record) => record.id} columns={columns} dataSource={posts} />
    </>
  )
}
