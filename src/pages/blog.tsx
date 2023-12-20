import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { ComponentProps } from 'react'

import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/config/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { getArticleList } from '@/lib/api/article'
import { transformData } from '@/lib/backend'

export const POSTS_PER_PAGE = 5

// export const getStaticProps: GetStaticProps<{
//   posts: ComponentProps<typeof ListLayout>['posts']
//   initialDisplayPosts: ComponentProps<typeof ListLayout>['initialDisplayPosts']
//   pagination: ComponentProps<typeof ListLayout>['pagination']
// }> = async () => {
//   // posts: [
//   //   {
//   //     title: '测试',
//   //     date: '2023-10-24T16:00:00.000Z',
//   //     lastmod: '2022/10/25',
//   //     tags: [ '微信' ],
//   //     draft: false,
//   //     summary: '我们前端工程师也可以做设计了，日常我需要为博客首图设计和公众号设计首图，下面分享下我的设计方法和技巧。',
//   //     images: [
//   //       'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e62d47750f444c4a6bc73cb8d8c2427~tplv-k3u1fbpfcp-watermark.image?'
//   //     ],
//   //     layout: 'PostLayout',
//   //     slug: '测试'
//   //   }
//   // ]
//   const posts = await getAllFilesFrontMatter('blog')
//   const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
//   const pagination = {
//     currentPage: 1,
//     totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
//   }

//   return { props: { initialDisplayPosts, posts, pagination } }
// }

export async function getServerSideProps(context) {
  // console.log("blog getServerSideProps context: ", context)
  // const res = await fetch(`http://127.0.0.1:8000/api/article`,  {
  //   // method: 'GET',
  //   headers: {
  //     'Accept': 'application/json'
  //   }
  // })

  // slug, date, title, summary, tags, images

  // const posts = transformData(await res.json())
  const posts = transformData(await getArticleList())

  // const posts = await getAllFilesFrontMatter('blog')
  // console.log("after trans posts:", posts)
  // console.log('/blog getServerSideProps:', posts)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
    },
  }
}

export default function Blog({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('Blog posts:')
  return (
    <>
      <PageSEO title={`全部文章 - ${siteMetadata.author}`} description={siteMetadata.description} />
      {/* <button class="btn btn-primary">Button</button> */}
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="全部文章"
      />
    </>
  )
}
