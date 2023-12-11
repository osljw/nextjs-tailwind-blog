import axios from 'axios'

// // export const apiUrl = process.env.NODE_ENV === 'production' ? 'testshell.pythonanywhere.com/api' : '127.0.0.1:8000/api'
// export const apiUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'http://testshell.pythonanywhere.com/api'
//     : 'http://192.168.0.106:8000/api'

const product_url = 'http://testshell.pythonanywhere.com/api'
// const product_url = "http://127.0.0.1:8000/api";
const dev_url = 'http://192.168.0.106:8000/api'
// const dev_url = "http://192.168.0.100:8000/api";
export const apiUrl = process.env.NODE_ENV === 'production' ? product_url : dev_url

//设置axios基础路径
const service = axios.create({
  baseURL: apiUrl,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
    // //在每次的请求中添加token
    // config.data = Object.assign({}, config.data, {
    //   token: token,
    // });
    //设置请求头
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'JWT ' + token,
    }
    //config.data = QS.stringify(config.data);
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
  // console.log("response:", response)
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
