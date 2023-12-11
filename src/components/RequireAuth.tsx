// 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// export async function getServerSideProps(context) {
//     const token = context.req.headers.cookie?.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

//     console.log("========token:", token, "===", context.req.headers.cookie)

//     if (!token) {
//         return {
//             redirect: {
//                 destination: '/login',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
//   }

const RequireAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter()
    const [login, setLogin] = useState(false)

    useEffect(() => {
      // 检查本地存储中是否存在 token，如果不存在则跳转到登录页面
      const token = localStorage.getItem('token')
      console.log('======token:', token)
      if (!token) {
        setLogin(false)
        router.push('/login')
      } else {
        setLogin(true)
      }
    }, [])

    return <>{login && <WrappedComponent {...props} />}</>
  }

  return WithAuth
}

export default RequireAuth
