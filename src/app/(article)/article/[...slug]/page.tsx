'use client'

import { useState, useEffect } from 'react'
import { Spin, Alert } from 'antd'

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

  if (post.type === 'html') {
    return (
      <>
        <TinymceEditor initialValue={post.body} readOnly={true} />
      </>
    )
  } else if (post.type === 'mdx') {
    return (
      <>
        <MDXEditor initialValue={post.body} readOnly={true} />
      </>
    )
  } else {
    return <></>
  }

  // const { mdxSource, toc, frontMatter } = post

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
