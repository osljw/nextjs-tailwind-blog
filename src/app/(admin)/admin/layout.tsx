'use client'
import '@/css/tailwind.css'

import { ThemeProvider } from 'next-themes'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useState, useEffect } from 'react'
import StyledComponentsRegistry from '@/components/AntdRegistry'

import { Button, Layout, Menu, theme as antdTheme } from 'antd'
import { AdminHeader } from './AdminHeader'
import RequireAuth from '@/components/RequireAuth'
const { Content, Footer, Sider } = Layout

function AdminLayout({ children }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const siderWidth = collapsed ? '0px' : '200px'

  const {
    token: { colorBgContainer },
  } = antdTheme.useToken()

  const toggleSider = () => {
    setCollapsed(!collapsed)
  }

  // label: 菜单显示名称， path：菜单跳转路由
  const menuConfig = {
    admin: {
      label: 'Admin',
      path: '/admin',
    },
    dashboard: {
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    article: {
      label: '文章管理',
      path: '/admin/article',
    },
    page: {
      label: '页面管理',
      path: '/admin/page',
    },
  }

  const menuItems = Object.entries(menuConfig).map(([key, value]) => ({
    ...value,
    key,
  }))

  console.log('menuItems:', menuItems)

  const onClick = (e) => {
    console.log('click ', menuConfig[e.key])
    router.push(menuConfig[e.key].path)
  }

  return (
    <>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <StyledComponentsRegistry>
          <Layout hasSider>
            <Sider
              breakpoint="sm"
              collapsedWidth={0}
              collapsible
              trigger={null}
              collapsed={collapsed}
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                width: siderWidth,
                background: colorBgContainer,
                // backgroundColor: 'transparent'
              }}
              onBreakpoint={(broken) => {
                console.log('onBreakpoint:', broken)
                if (broken) setCollapsed(true)
                else setCollapsed(false)
              }}
            >
              {/* <div className="demo-logo-vertical" /> */}
              <Menu
                onClick={onClick}
                mode="inline"
                // defaultSelectedKeys={['4']}
                items={menuItems}
              />
            </Sider>
            <Layout
              style={{
                minHeight: '100vh',
                marginLeft: siderWidth,
              }}
            >
              <AdminHeader collapsed={collapsed} toggleSider={toggleSider} />

              <Content
                style={{
                  background: colorBgContainer,
                }}
              >
                <div
                  // className="prose max-w-none break-words pb-8 pt-10 dark:prose-dark"
                  style={{
                    marginLeft: '16px',
                    marginRight: '16px',
                    // overflow: 'auto',
                  }}
                >
                  {children}
                </div>
              </Content>
              <Footer
                style={{
                  textAlign: 'center',
                  // padding: 0,
                  background: colorBgContainer,
                }}
              >
                Admin ©2023 nextjs + antd + tailwind
              </Footer>
            </Layout>
          </Layout>
        </StyledComponentsRegistry>
      </ThemeProvider>
    </>
  )
}

export default RequireAuth(AdminLayout)
