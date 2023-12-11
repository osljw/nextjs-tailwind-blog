import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

import { Button, Layout, theme as antdTheme } from 'antd'
import { Avatar, Menu, Dropdown } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons'
const { Header } = Layout

export function AdminHeader({ collapsed, toggleSider }) {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const {
    token: { colorBgContainer },
  } = antdTheme.useToken()

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    console.log('toggle theme', nextTheme)
  }

  const handleExit = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
  const menuItems = [
    {
      key: '1',
      label: <Button onClick={handleExit}>退出</Button>,
    },
  ]

  return (
    <>
      <Header
        className="flex items-center justify-between"
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        {collapsed ? (
          <MenuUnfoldOutlined className="ml-4 cursor-pointer text-2xl" onClick={toggleSider} />
        ) : (
          <MenuFoldOutlined className="ml-4 cursor-pointer text-2xl" onClick={toggleSider} />
        )}

        <Button onClick={toggleTheme}> 切换主题 </Button>

        <div className="flex items-center" style={{ marginRight: '16px' }}>
          <Dropdown
            className="ml-4 cursor-pointer text-2xl"
            menu={{ items: menuItems }}
            // placement="bottomRight"
            arrow={true}
            autoAdjustOverflow={true}
          >
            <div>
              <Avatar></Avatar>

              <DownOutlined style={{ fontSize: '16px' }} />
            </div>
          </Dropdown>
        </div>
      </Header>
    </>
  )
}
