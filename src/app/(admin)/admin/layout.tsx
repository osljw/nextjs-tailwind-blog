'use client'
import '@/css/tailwind.css'

import { ThemeProvider } from 'next-themes'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState, useEffect } from 'react'
import StyledComponentsRegistry from '@/components/AntdRegistry'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Layout, Menu, theme as antdTheme } from 'antd'
const { Header, Content, Footer, Sider } = Layout

export default function AdminLayout({ children }) {
  const router = useRouter()
  // const { theme, setTheme, resolvedTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

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
      <ThemeProvider defaultTheme="light" attribute="class">
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
                // position: 'fixed',
                // left: 0,
                // top: 0,
                // bottom: 0,
                background: colorBgContainer,
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
                // theme={theme || 'light'}
                mode="inline"
                // defaultSelectedKeys={['4']}
                items={menuItems}
              />
            </Sider>
            <Layout
              style={{
                minHeight: '100vh',
              }}
            >
              <Header
                style={{
                  padding: 0,
                  background: colorBgContainer,
                }}
              >
                {collapsed ? (
                  <MenuUnfoldOutlined
                    className="ml-4 cursor-pointer text-2xl"
                    onClick={toggleSider}
                  />
                ) : (
                  <MenuFoldOutlined
                    className="ml-4 cursor-pointer text-2xl"
                    onClick={toggleSider}
                  />
                )}
              </Header>

              <Content
                style={{
                  marginLeft: '16px',
                  marginRight: '16px',
                  overflow: 'auto',
                  background: colorBgContainer,
                }}
              >
                {children}
              </Content>
              <Footer
                style={{
                  textAlign: 'center',
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
