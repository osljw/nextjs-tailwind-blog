import { formatSlug } from './mdx'

import { dateSortDesc } from './utils'

export function transformData(oldData) {
  //   console.log('oldData:', oldData)

  const newData = oldData.map((oldItem) => {
    const { id, title, create_time: date, update_time: lastmod, /*tags,*/ is_show: draft } = oldItem
    const summary = '' // 添加新的摘要字段
    const images = [] // 添加新的图片字段
    const layout = 'PostLayout' // 添加新的布局字段
    // const slug = formatSlug(title) // 添加新的链接字段
    const slug = id

    return {
      title,
      date,
      lastmod,
      tags: [],
      draft: !draft,
      summary,
      images,
      layout,
      slug,
    }
  })

  return newData.sort((a, b) => dateSortDesc(a.date, b.date))
}
