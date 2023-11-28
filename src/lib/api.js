let apiUrl =
  process.env.NODE_ENV === 'production' ? 'testshell.pythonanywhere.com/api' : '127.0.0.1:8000/api'

// apiUrl = 'testshell.pythonanywhere.com/api'

export async function getArticleList() {
  const res = await fetch(`http://${apiUrl}/article`, {
    // method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const posts = await res.json()

  return posts
}

export async function getArticle(id) {
  const res = await fetch(`http://${apiUrl}/article/${id}`, {
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
  const res = await fetch(`http://${apiUrl}/article`, {
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
  const res = await fetch(`http://${apiUrl}/article/${data.id}`, {
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

export async function deleteArticle(id) {
  console.log('delete data:', id)
  const res = await fetch(`http://${apiUrl}/article/${id}`, {
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
