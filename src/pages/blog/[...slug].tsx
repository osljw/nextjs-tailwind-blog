import fs from 'fs'

import {
  formatSlug,
  getAllFilesFrontMatter,
  getFileBySlug,
  getPostBySlug,
  getFiles,
  getMDXSource,
} from '@/lib/mdx'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { AuthorFrontMatter } from 'types/AuthorFrontMatter'
import { PostFrontMatter } from 'types/PostFrontMatter'
import { Toc } from 'types/Toc'
import readingTime from 'reading-time'

import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getArticle, getArticleList } from '@/lib/api/article'
import TinymceEditor from '@/editor/TinymceEditor'
import MDXEditor from '@/editor/MDXEditor'

// const DEFAULT_LAYOUT = 'PostLayout'
// const DEFAULT_DATA_FROM = 'backend' // file | backend

// export async function getStaticPaths() {
//   let posts

//   if (DEFAULT_DATA_FROM === 'file') {
//     posts = getFiles('blog').filter((post) => post.endsWith('md'))

//     posts = posts.map((p) => ({
//       params: {
//         slug: formatSlug(p).split('/'),
//       },
//     }))
//   } else {
//     // posts = await getArticleSlugList()
//     posts = await getArticleList()
//     // console.log('getArticleSlugList posts:', posts)
//     // posts = posts.map((item) => ({
//     //   params: {
//     //     slug: `${item.slug}`.split('/'),
//     //   }
//     // }))
//     posts = posts.map((p) => `${p.id}`)

//     posts = posts.map((p) => {
//       // console.log("path:", p)
//       // console.log("path:", formatSlug(p).split('/'))
//       return {
//         params: {
//           slug: formatSlug(p).split('/'),
//         },
//       }
//     })
//   }

//   console.log('/blog/* getStaticPaths=========:', JSON.stringify(posts))
//   return {
//     paths: posts,
//     fallback: false,
//   }
// }

// // @ts-ignore
// export const getStaticProps: GetStaticProps<{
//   post: { mdxSource: string; toc: Toc; frontMatter: PostFrontMatter }
//   authorDetails: AuthorFrontMatter[]
//   prev?: { slug: string; title: string }
//   next?: { slug: string; title: string }
// }> = async ({ params }) => {
//   console.log('/blog/* getStaticProps slug:', params.slug)

//   let post

//   const slug = (params.slug as string[]).join('/')
//   // const allPosts = await getAllFilesFrontMatter('blog')
//   // // const allPosts = await getArticleList()
//   // const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === slug)
//   // const prev: { slug: string; title: string } = allPosts[postIndex + 1] || null
//   // const next: { slug: string; title: string } = allPosts[postIndex - 1] || null
//   // const post = await getFileBySlug<PostFrontMatter>('blog', slug)
//   post = await getPostBySlug(slug)
//   if (post.type) {
//     return {
//       props: {
//         post,
//       },
//     }
//   }
//   // post: {
//   //   mdxSource: 'var Component=(()=>{var m=Object.create;var a=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,j=Object.prototype.hasOwnProperty;var p=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),d=(t,e)=>{for(var n in e)a(t,n,{get:e[n],enumerable:!0})},u=(t,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of _(e))!j.call(t,o)&&o!==n&&a(t,o,{get:()=>e[o],enumerable:!(s=x(e,o))||s.enumerable});return t};var g=(t,e,n)=>(n=t!=null?m(f(t)):{},u(e||!t||!t.__esModule?a(n,"default",{value:t,enumerable:!0}):n,t)),l=t=>u(a({},"__esModule",{value:!0}),t);var i=p((X,c)=>{c.exports=_jsx_runtime});var D={};d(D,{default:()=>C});var r=g(i());function M(t={}){let{wrapper:e}=t.components||{};return e?(0,r.jsx)(e,Object.assign({},t,{children:(0,r.jsx)(n,{})})):n();function n(){return(0,r.jsx)(r.Fragment,{})}}var C=M;return l(D);})();\n' +
//   //     ';return Component;',
//   //   toc: [],
//   //   frontMatter: {
//   //     readingTime: { text: '1 min read', minutes: 0.14, time: 8400, words: 28 },
//   //     slug: 't1',
//   //     fileName: 't1.md',
//   //     date: null
//   //   }
//   // }
//   // console.log('post:', post)

//   // @ts-ignore
//   // const authorList = post.frontMatter.authors || ['default']
//   // const authorPromise = authorList.map(async (author) => {
//   //   const authorResults = await getFileBySlug<AuthorFrontMatter>('authors', [author])
//   //   return authorResults.frontMatter
//   // })
//   // const authorDetails = await Promise.all(authorPromise)

//   // [
//   //   {
//   //     readingTime: { text: '1 min read', minutes: 0.17, time: 10200, words: 34 },
//   //     slug: [ 'default' ],
//   //     fileName: 'default.md',
//   //     name: '狂奔滴小马',
//   //     avatar: '/static/images/avatar.png',
//   //     occupation: '前端工程师',
//   //     company: '分享 JavaScript 热门框架，记录前端工程师学习成长历程。',
//   //     email: 'maqi1520@163.com',
//   //     juejin: 'https://juejin.cn/user/2189882895384093',
//   //     zhihu: 'https://www.zhihu.com/people/xiao-ma-15-3',
//   //     github: 'https://github.com/maqi1520',
//   //     date: null
//   //   }
//   // ]

//   // console.log('authorDetails:', authorDetails)
//   // console.log('getFileBySlug post:', post)
//   // rss
//   // if (allPosts.length > 0) {
//   //   const rss = generateRss(allPosts)
//   //   fs.writeFileSync('./public/feed.xml', rss)
//   // }

//   return {
//     props: {
//       post,
//       // authorDetails,
//       // prev,
//       // next,
//     },
//   }
// }

export async function getServerSideProps({ params }) {
  const slug = (params.slug as string[]).join('/')
  const post = await getPostBySlug(slug)

  return {
    props: {
      post,
    },
  }
}

export default function Blog({
  post,
  authorDetails,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('======blog [id] post', post)
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
  }

  const { mdxSource, toc, frontMatter } = post

  return (
    <>
      {'draft' in frontMatter && frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
