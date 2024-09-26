import { GetStaticProps } from 'next'

import MDXEditor from '@/editor/MDXEditor'
import { getPageList, searchPage } from '@/lib/api/page'
import { formatSlug } from '@/lib/mdx'

// export async function getStaticPaths() {
//   let posts = await getPageList()

//   posts = posts.map((p) => `${p.url}`)

//   posts = posts.map((p) => {
//     // console.log("path:", p)
//     // console.log("path:", formatSlug(p).split('/'))
//     return {
//       params: {
//         slug: formatSlug(p).split('/'),
//       },
//     }
//   })

//   console.log('/[...slugs] paths:', JSON.stringify(posts))

//   return {
//     paths: posts,
//     fallback: false,
//   }
// }

// // @ts-ignore
// export const getStaticProps = async ({ params }) => {
//   const slug = (params.slug as string[]).join('/')

//   const posts: [] = await searchPage(slug)

//   return { props: { post: posts.length > 0 ? posts[0] : undefined } }
// }

// @ts-ignore
export const getServerSideProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/')

  const posts: [] = await searchPage(slug)
  console.log('===getServerSideProps:', slug, posts)

  return { props: { post: posts.length > 0 ? posts[0] : undefined } }
}

export default function About({ post }) {
  console.log('======post:', post)
  return (
    <>
      <MDXEditor initialValue={post.body} readOnly={true} />
    </>
  )
}
