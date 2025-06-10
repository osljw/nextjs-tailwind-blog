'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Spin, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { UserOutlined, CalendarOutlined, HistoryOutlined } from '@ant-design/icons'

// import { AuthorFrontMatter } from 'types/AuthorFrontMatter'
// import { PostFrontMatter } from 'types/PostFrontMatter'
// import { Toc } from 'types/Toc'
// import readingTime from 'reading-time'

import { getArticle } from '@/lib/api/article'
// import PageTitle from '@/components/PageTitle'
// import generateRss from '@/lib/generate-rss'
// import { MDXLayoutRenderer } from '@/components/MDXComponents'
import TinymceEditor from '@/editor/TinymceEditor'
import MDXEditor from '@/editor/MDXEditor'

interface Props {
  params: {
    slug: string[]
  }
}

export default function Blog({ params }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)

  // 获取动态路由参数
  const slug = params.slug.join('/')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      console.log('get data')

      const startTime = performance.now() // 高精度时间测量
      const postData = await getArticle(slug)
      const endTime = performance.now()
      const duration = endTime - startTime

      console.log('数据获取完成:', {
        time: new Date().toISOString(),
        duration: `${duration.toFixed(2)}ms`,
        dataSize: JSON.stringify(postData).length / 1024 + 'KB',
      })
      console.log('article [id] post', postData)
      setPost(postData)

      setLoading(false)
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Spin size="large" />
      </div>
    )
  }

  // 外链文章跳转
  if (post.type === 'external') {
    // router.push(`${post.body}`)
    window.open(post.body, '_blank') // 编程式新标签页跳转
    // return
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 md:px-8 lg:px-12">
      <div className="flex-grow">
        <div className="border-b pb-8 pt-4">
          <h1 className="text-4xl font-bold tracking-tight" style={{ position: 'sticky' }}>
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.auth && (
              <span className="flex items-center">
                <UserOutlined className="mr-2 h-5 w-5" />
                {post.auth}
              </span>
            )}
            {post.create_time && (
              <span className="flex items-center">
                <CalendarOutlined className="mr-2 h-5 w-5" />
                发布于{new Date(post.create_time).toLocaleDateString()}
              </span>
            )}

            {post.update_time && (
              <span className="flex items-center">
                <HistoryOutlined className="mr-2 h-5 w-5" />
                更新于{new Date(post.update_time).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* 编辑器内容 */}
        {post.type === 'html' ? (
          <TinymceEditor initialValue={post.body} readOnly={true} />
        ) : post.type === 'mdx' ? (
          <MDXEditor initialValue={post.body} readOnly={true} />
        ) : post.type === 'external' ? (
          <p className="mt-4 animate-pulse text-gray-600">
            如果页面没有自动跳转，请{' '}
            <a
              href={post.body}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              点击这里
            </a>
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-0 mt-8 bg-white/90 py-4 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="flex justify-center">
          <Button
            type="primary"
            shape="round"
            icon={<ArrowLeftOutlined className="align-middle text-[1.25em]" />}
            onClick={() => router.back()}
            className="
          h-12 bg-gradient-to-r from-blue-500
          to-purple-500 px-8 text-lg
          shadow-lg transition-all
          duration-300 hover:from-blue-600
          hover:to-purple-600 hover:shadow-xl
          dark:from-blue-600 dark:to-purple-600
          dark:hover:from-blue-700 dark:hover:to-purple-700
        "
          >
            <span className="ml-2">返回文章列表</span>
          </Button>
        </div>
      </div>
    </div>
  )

  // const {mdxSource, toc, frontMatter} = post

  // return (
  //   <>
  //     {'draft' in frontMatter && frontMatter.draft !== true ? (
  //       <MDXLayoutRenderer
  //         layout={frontMatter.layout || DEFAULT_LAYOUT}
  //         toc={toc}
  //         mdxSource={mdxSource}
  //         frontMatter={frontMatter}
  //         // authorDetails={authorDetails}
  //         // prev={prev}
  //         // next={next}
  //       />
  //     ) : (
  //       <div className="mt-24 text-center">
  //         <PageTitle>
  //           Under Construction{' '}
  //           <span role="img" aria-label="roadwork sign">
  //             🚧
  //           </span>
  //         </PageTitle>
  //       </div>
  //     )}
  //   </>
  // )
}
