import service from './config'

export async function getArticleCategoryList(data = {}) {
  //   const params = new URLSearchParams()
  //   Object.keys(data).forEach((key) => {
  //     if (data[key] !== undefined) {
  //       params.append(key, data[key])
  //     }
  //   })

  const res = await service.get(`/article/category`)
  // console.log("======res:", res)
  return res
}

export async function getArticleCategory(id) {
  return service.get(`/article/category/${id}`)
}

export async function getCategoryArticles(id) {
  return service.get(`/article/category/${id}/articles`)
}

// export async function postArticle(data) {
//   return service.post(`/article`, data)
// }

// export async function putArticle(data) {

//   return service.put(`/article/${data.id}`, data)
// }

// export async function patchArticle(data) {

//   return service.patch(`/article/${data.id}`, data)
// }

// export async function deleteArticle(id) {
//   return service.delete(`/article/${id}`)
// }
