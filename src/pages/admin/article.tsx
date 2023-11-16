import TabPage from '@/components/TabPage'
import { useEffect } from 'react'
import { Table } from 'antd'

import { getArticleList } from '@/lib/backend'

export const testdata = [
  // AI
  {
    name: 'phind',
    url: 'https://www.phind.com/',
    category: 'AI',
  },
  {
    name: 'theb',
    url: 'https://beta.theb.ai/home',
    category: 'AI',
  },

  // 下载
  {
    name: '文件下载在线代理',
    url: 'https://respeed.chromiumer.com/',
    category: '下载',
  },

  // 办公
  {
    name: 'PDF转换',
    url: 'https://tool.browser.qq.com/category/pdf',
    category: '文档',
  },
  {
    name: '思维导图',
    url: 'https://www.iodraw.com/mind',
    category: '文档',
  },

  // 编辑器
  {
    url: 'https://editor.runjs.cool/',
  },

  // 博客
  {
    url: 'https://maqib.cn/',
  },
] //.map((item, index) => { return { key: index.toString(), ...item } })

const columns = [
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'url',
    dataIndex: 'url',
    key: 'url',
  },
]

export async function getServerSideProps(context) {
  const posts = await getArticleList()
  console.log('article posts:', posts)

  // const tabData = [...new Set(posts.map((item) => item.category))].map(
  //   (category) => ({
  //     key: category,
  //     tab: category,
  //   })
  // );

  // const pagination = {
  //   currentPage: 1,
  //   totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  // }
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
    },
    // {
    //   title: "url",
    //   dataIndex: "url",
    //   key: "url",
    // },
  ]

  return {
    props: {
      posts,
      columns,
    },
  }
}

export default function Article({ posts, columns }) {
  return (
    <>
      <Table rowKey={(record) => record.title} columns={columns} dataSource={posts} />
    </>
  )
}
