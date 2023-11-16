import { formatSlug } from './mdx'

export function transformData(oldData) {
  //   console.log('oldData:', oldData)

  const newData = oldData.map((oldItem) => {
    const { id, title, create_time: date, update_time: lastmod, tags, is_show: draft } = oldItem
    const summary = '' // 添加新的摘要字段
    const images = [] // 添加新的图片字段
    const layout = 'PostLayout' // 添加新的布局字段
    // const slug = formatSlug(title) // 添加新的链接字段
    const slug = id

    return {
      title,
      date,
      lastmod,
      tags,
      draft,
      summary,
      images,
      layout,
      slug,
    }
  })

  return newData
}

export async function getArticleList() {
  const res = await fetch(`http://127.0.0.1:8000/api/article`, {
    // method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  // slug, date, title, summary, tags, images
  const posts = transformData(await res.json())

  return posts
}

export async function getArticleSlugList() {
  const posts = await getArticleList()
  console.log('getArticleSlugList posts:', posts)
  return posts.map((item) => `${item.slug}`)
}

export async function getArticle(id) {
  const res = await fetch(`http://127.0.0.1:8000/api/article/${id}`, {
    // method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  // console.log("res: ", res)

  // slug, date, title, summary, tags, images
  return await res.json()
}
