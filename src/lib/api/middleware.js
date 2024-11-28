import { NextResponse } from 'next/server'
import { isValidToken } from './config' // 假设这里有判断token是否有效的函数

export function middleware(request) {
  console.log('===middleware==')
  if (!isValidToken()) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/books/borrow'], // 这里指定该中间件应用的路由路径，可以根据需要添加更多的路径，支持通配符等多种匹配方式
}
