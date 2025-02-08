import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/config/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../blog'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { PostFrontMatter } from 'types/PostFrontMatter'

import { transformData } from '@/lib/backend'
import { getArticleList } from '@/lib/api/article'

// export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
//   const totalPosts = await getAllFilesFrontMatter('blog')
//   const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE)
//   const paths = Array.from({ length: totalPages }, (_, i) => ({
//     params: { page: (i + 1).toString() },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

// export const getStaticProps: GetStaticProps<{
//   posts: PostFrontMatter[]
//   initialDisplayPosts: PostFrontMatter[]
//   pagination: { currentPage: number; totalPages: number }
// }> = async (context) => {
//   const {
//     params: { page },
//   } = context
//   const posts = await getAllFilesFrontMatter('blog')
//   const pageNumber = parseInt(page as string)
//   const initialDisplayPosts = posts.slice(
//     POSTS_PER_PAGE * (pageNumber - 1),
//     POSTS_PER_PAGE * pageNumber
//   )
//   const pagination = {
//     currentPage: pageNumber,
//     totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
//   }

//   return {
//     props: {
//       posts,
//       initialDisplayPosts,
//       pagination,
//     },
//   }
// }

export async function getServerSideProps(context) {
  const {
    params: { page },
  } = context

  // const posts = await getAllFilesFrontMatter('blog')
  // const posts = await getArticleList()
  const posts = transformData(await getArticleList())

  console.log('/blog/page getServerSideProps:', page)
  const pageNumber = parseInt(page as string)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
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

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="所有文章"
      />
    </>
  )
}
