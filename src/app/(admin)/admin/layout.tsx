'use client'
import '@/css/tailwind.css'

import { ThemeProvider } from 'next-themes'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import StyledComponentsRegistry from '@/components/AntdRegistry'

import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
const { Header, Content, Footer, Sider } = Layout

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { theme } = useTheme()

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
      label: 'Article',
      path: '/admin/article',
    },
  }

  const menuItems = Object.entries(menuConfig).map(([key, value]) => ({
    ...value,
    key,
  }))

  console.log('menuItems:', menuItems, ' theme:', theme || 'light')

  const onClick = (e) => {
    console.log('click ', menuConfig[e.key])
    router.push(menuConfig[e.key].path)
  }

  return (
    <>
      <ThemeProvider>
        <StyledComponentsRegistry>
          <Layout hasSider>
            <Sider
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
              }}
              theme={theme || 'light'}
            >
              <div className="demo-logo-vertical" />
              <Menu
                onClick={onClick}
                theme={theme || 'light'}
                mode="inline"
                // defaultSelectedKeys={['4']}
                items={menuItems}
              />
            </Sider>
            <Layout
              className="site-layout"
              style={{
                marginLeft: 200,
              }}
            >
              <Header
                style={{
                  padding: 0,
                  // background: colorBgContainer,
                }}
              />
              <Content
                style={{
                  margin: '24px 16px 0',
                  overflow: 'initial',
                }}
              >
                {children}
                {/* <div
                style={{
                  padding: 24,
                  textAlign: 'center',
                  // background: colorBgContainer,
                }}
              >
                <p>long content</p>
                {
                  // indicates very long content
                  Array.from(
                    {
                      length: 100,
                    },
                    (_, index) => (
                      <React.Fragment key={index}>
                        {index % 20 === 0 && index ? 'more' : '...'}
                        <br />
                      </React.Fragment>
                    ),
                  )
                }
              </div> */}
              </Content>
              <Footer
                style={{
                  textAlign: 'center',
                }}
              >
                Ant Design ©2023 Created by Ant UED
              </Footer>
            </Layout>
          </Layout>
        </StyledComponentsRegistry>
      </ThemeProvider>
    </>
  )
}
