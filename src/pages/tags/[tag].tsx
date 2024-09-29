import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/config/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import generateRss from '@/lib/generate-rss'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import fs from 'fs'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import path from 'path'
import { PostFrontMatter } from 'types/PostFrontMatter'

import { transformData } from '@/lib/backend'
import { getArticleList } from '@/lib/api/article'
import { extractTags } from '@/lib/tags'

const root = process.cwd()

// export async function getStaticPaths() {
//   // const tags = await getAllTags('blog')
//   const allPosts = transformData(await getArticleList())
//   const tags = extractTags(allPosts)

//   return {
//     paths: Object.keys(tags).map((tag) => ({
//       params: {
//         tag,
//       },
//     })),
//     fallback: false,
//   }
// }

// export const getStaticProps: GetStaticProps<{ posts: PostFrontMatter[]; tag: string }> = async (
//   context
// ) => {
//   const tag = context.params.tag as string
//   // const allPosts = await getAllFilesFrontMatter('blog')
//   const allPosts = transformData(await getArticleList())

//   const filteredPosts = allPosts.filter(
//     (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag)
//   )

//   // rss
//   if (filteredPosts.length > 0) {
//     const rss = generateRss(filteredPosts, `tags/${tag}/feed.xml`)
//     const rssPath = path.join(root, 'public', 'tags', tag)
//     fs.mkdirSync(rssPath, { recursive: true })
//     fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
//   }

//   return { props: { posts: filteredPosts, tag } }
// }

export async function getServerSideProps(context) {
  const tag = context.params.tag as string
  // const allPosts = await getAllFilesFrontMatter('blog')
  const allPosts = transformData(await getArticleList())

  console.log('allPosts====', allPosts)
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag)
  )

  return { props: { posts: filteredPosts, tag } }
}

export default function Tag({ posts, tag }: InferGetStaticPropsType<typeof getStaticProps>) {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.title}`}
        description={`${tag} tags - ${siteMetadata.author}`}
      />
      <ListLayout posts={posts} title={title} />
    </>
  )
}
