'use client'

import LayoutWrapper from '@/components/LayoutWrapper'
import { Layout } from 'antd'
import React from 'react'

export default function App({ children }) {
  return (
    // <Layout className="min-h-screen">
    //     {/* 修复后的 Header */}
    //     <Layout.Header className="h-16 bg-blue-600 px-4 flex items-center justify-between">
    //         {/* 左侧 Logo */}
    //         {/* <div className="text-white text-xl font-bold shrink-0">Logo</div> */}

    //         {/* 导航菜单 - 修复换行问题 */}
    //         <nav className="hidden md:flex items-center gap-x-6 overflow-x-auto">
    //             <a href="#" className="text-white hover:text-blue-200 transition-colors whitespace-nowrap">首页</a>
    //             <a href="#" className="text-white hover:text-blue-200 transition-colors whitespace-nowrap">产品</a>
    //             <a href="#" className="text-white hover:text-blue-200 transition-colors whitespace-nowrap">关于</a>
    //             <a href="#" className="text-white hover:text-blue-200 transition-colors whitespace-nowrap">联系我们</a>
    //         </nav>

    //         {/* 移动端菜单按钮（可选） */}
    //         <button className="md:hidden text-white text-2xl">☰</button>
    //     </Layout.Header>

    //     {/* 内容区域 */}
    //     {children}
    // </Layout>
    <LayoutWrapper>{children}</LayoutWrapper>
  )
}
