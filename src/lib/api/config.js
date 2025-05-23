import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
// // export const apiUrl = process.env.NODE_ENV === 'production' ? 'testshell.pythonanywhere.com/api' : '127.0.0.1:8000/api'
// export const apiUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'http://testshell.pythonanywhere.com/api'
//     : 'http://192.168.0.106:8000/api'

export function isValidToken() {
  const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token')

  if (token && !isTokenExpired(token)) {
    return true
  } else {
    return false
  }
}

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token)
    const dateNow = new Date()

    console.log('decoded token:', decoded)

    return decoded.exp < dateNow.getTime() / 1000
  } catch (err) {
    console.log('err:', err)
    return false
  }
}

// const product_url = 'http://testshell.pythonanywhere.com/api'
const product_url = 'http://127.0.0.1:8001/api'
// const dev_url = 'http://192.168.0.106:8000/api'
const dev_url = 'http://127.0.0.1:8001/api'
export const apiUrl = process.env.NODE_ENV === 'production' ? product_url : dev_url

//设置axios基础路径
const service = axios.create({
  baseURL: apiUrl,
})

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    // //在每次的请求中添加token
    // config.data = Object.assign({}, config.data, {
    //   token: token,
    // });
    //设置请求头
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      // 'Cache-Control': 'no-cache',
    }

    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
      // if (token && refreshToken && isTokenExpired(token)) {
      //   config.headers['Authorization'] = 'JWT ' + token
      // }

      console.log('===token:', token)

      if (token && isTokenExpired(token)) {
        // const response = await apiClient.post('/api/token/refresh/', { refresh: refreshToken });
        // const newAccessToken = response.data.access;

        // localStorage.setItem('access_token', newAccessToken);
        localStorage.removeItem('token')
        // config.headers.Authorization = `JWT ${newAccessToken}`;
      } else if (token) {
        // config.headers.Authorization = `JWT ${token}`
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // console.log('====config:', config)
    return config
  },
  (error) => {
    return error
  }
)

// 响应拦截器
service.interceptors.response.use((response) => {
  //根据返回不同的状态码做不同的事情
  // 这里一定要和后台开发人员协商好统一的错误状态码
  // console.log("=====response:", response)
  if (response.status) {
    switch (response.status) {
      case 200:
      case 201:
        // console.log("response:", response.data)
        return response.data
      case 401:
        //未登录处理方法
        break
      case 403:
        //token过期处理方法
        break
      case 404:
        break
      default:
      //message.error(response.data.msg)
    }
  } else {
    return response
  }
})

//最后把封装好的axios导出
export default service
