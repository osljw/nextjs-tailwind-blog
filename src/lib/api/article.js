import { apiUrl } from './config'
import service from './config'

export async function getArticleList(data = {}) {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      params.append(key, data[key])
    }
  })

  console.log('=========article request:', params.toString())
  const res = await service.get(`/article?${params.toString()}`)
  // console.log("======res:", res)
  return res
}

export async function getArticle(id) {
  // const res = await fetch(`${apiUrl}/article/${id}`, {
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/json',
  //   },
  // })

  // // console.log("res: ", res)

  // return await res.json()
  return service.get(`/article/${id}`)
}

export async function postArticle(data) {
  // // console.log('post data:', data)
  // const res = await fetch(`${apiUrl}/article`, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })

  // // console.log("res: ", res)

  // return await res.json()
  return service.post(`/article`, data)
}

export async function putArticle(data) {
  // // console.log('put data:', data)
  // const res = await fetch(`${apiUrl}/article/${data.id}`, {
  //   method: 'PUT',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })

  // console.log('res: ', res)

  // return await res.json()

  return service.put(`/article/${data.id}`, data)
}

export async function patchArticle(data) {
  // console.log('pathch data:', data)
  // const res = await fetch(`${apiUrl}/article/${data.id}`, {
  //   method: 'PATCH',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })

  // return await res.json()

  return service.patch(`/article/${data.id}`, data)
}

export async function deleteArticle(id) {
  // // console.log('delete data:', id)
  // const res = await fetch(`${apiUrl}/article/${id}`, {
  //   method: 'DELETE',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   // body: JSON.stringify(data),
  // })

  // return res

  return service.delete(`/article/${id}`)
}
