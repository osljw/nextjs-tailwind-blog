import { apiUrl } from './config'
import service from './config'

export async function getPageList(data = {}) {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      params.append(key, data[key])
    }
  })

  const res = await service.get(`${apiUrl}/page?${params.toString()}`)
  return res

  // try {
  //   // const res = await fetch(`${apiUrl}/page?${params.toString()}`, {
  //   //   // method: 'GET',
  //   //   headers: {
  //   //     Accept: 'application/json',
  //   //   },
  //   // })

  //   if (!res.ok) {
  //     throw new Error('Error fetching page list')
  //   }

  //   const posts = await res.json()

  //   return posts
  // } catch (error) {
  //   // 错误处理逻辑
  //   console.error('An error occurred while fetching the page list:', error)
  //   // 可以选择返回一个默认的空数组或其他默认值
  //   return []
  // }
}

export async function getPage(id) {
  const res = await fetch(`${apiUrl}/page/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  // console.log("res: ", res)

  return await res.json()
}

export async function searchPage(query) {
  const res = await fetch(`${apiUrl}/page?search=${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  return await res.json()
}

export async function postPage(data) {
  // console.log('post data:', data)
  const res = await fetch(`${apiUrl}/page`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  // console.log("res: ", res)

  return await res.json()
}

export async function putPage(data) {
  // console.log('put data:', data)
  const res = await fetch(`${apiUrl}/page/${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  // console.log("res: ", res)

  return await res.json()
}

export async function patchPage(data) {
  console.log('pathch data:', data)
  const res = await service.patch(`${apiUrl}/page/${data.id}`, data)
  return res
}

export async function deletePage(id) {
  // console.log('delete data:', id)
  const res = await fetch(`${apiUrl}/page/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  })

  // console.log("res: ", res)

  return res
}
