import { apiUrl } from './api/config'

export async function getArticleList(data = {}) {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      params.append(key, data[key])
    }
  })

  console.log('=========article request:', params.toString())

  try {
    const res = await fetch(`${apiUrl}/article?${params.toString()}`, {
      // method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error('Error fetching article list')
    }

    const posts = await res.json()

    return posts
  } catch (error) {
    // 错误处理逻辑
    console.error('An error occurred while fetching the article list:', error)
    // 可以选择返回一个默认的空数组或其他默认值
    return []
  }
}

export async function getArticle(id) {
  const res = await fetch(`${apiUrl}/article/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  // console.log("res: ", res)

  return await res.json()
}

export async function postArticle(data) {
  // console.log('post data:', data)
  const res = await fetch(`${apiUrl}/article`, {
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

export async function putArticle(data) {
  // console.log('put data:', data)
  const res = await fetch(`${apiUrl}/article/${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  console.log('res: ', res)

  return await res.json()
}

export async function patchArticle(data) {
  console.log('pathch data:', data)
  const res = await fetch(`${apiUrl}/article/${data.id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  console.log('res: ', res)

  return await res.json()
}

export async function deleteArticle(id) {
  // console.log('delete data:', id)
  const res = await fetch(`${apiUrl}/article/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  })

  // console.log("res: ", res)

  return await res.json()
}
