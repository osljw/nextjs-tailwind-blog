import { useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { HomeOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const MyLayout = ({ children }) => {
  const [selectedKeys, setSelectedKeys] = useState(['/'])

  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key])
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>Title Bar</Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <a href="/">Home</a>
            </Menu.Item>
            <SubMenu key="dashboard" icon={<DashboardOutlined />} title="Dashboard">
              <Menu.Item key="/dashboard/overview">
                <a href="/dashboard/overview">Overview</a>
              </Menu.Item>
              <Menu.Item key="/dashboard/analytics">
                <a href="/dashboard/analytics">Analytics</a>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="/article" icon={<UserOutlined />}>
              <a href="/admin/article"> 文章管理 </a>
            </Menu.Item>
          </Menu>
        </Sider>

        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKeys[0]}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MyLayout
