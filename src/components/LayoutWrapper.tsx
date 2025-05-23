import siteMetadata from '@/config/siteMetadata'
import headerNavLinks from 'src/config/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { ReactNode, useEffect } from 'react'
import { getPageList } from '@/lib/api/page'
import { useState } from 'react'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const [navs, setNavs] = useState([])

  // useEffect(() => {
  //   getPageList().then((pages) => {
  //     console.log('pages:', pages)

  //     setNavs(pages.map((page) => ({ href: `/${page.url}`, title: page.title })))
  //   })
  // }, [])

  return (
    <SectionContainer>
      <div
        className="flex min-h-screen flex-col"
        style={{ '--header-height': '4rem' } as React.CSSProperties}
      >
        {/* <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="ml-1 mr-1 flex items-center sm:ml-4">
              <a className="block p-1" title="RSS" href="/feed.xml">
                <svg
                  fill="currentColor"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M3.75 3a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75V16C17 8.82 11.18 3 4 3h-.25z"></path>
                  <path d="M3 8.75A.75.75 0 013.75 8H4a8 8 0 018 8v.25a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75V16a6 6 0 00-6-6h-.25A.75.75 0 013 9.25v-.5zM7 15a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </a>
              <ThemeSwitch />
            </div>
            <MobileNav />
          </div>
        </header> */}
        <header className="fixed left-0 right-0 top-0 z-50 h-[var(--header-height)] border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
          <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4 py-5 sm:px-6 xl:max-w-5xl xl:px-0">
            {/* 原有 header 内部内容完全保留 */}
            <div className="h-full">
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="flex h-full items-center justify-between">
                  <div className="mr-3 flex h-[calc(var(--header-height)*0.8)] items-center">
                    <Logo className="h-full w-auto text-black" />
                  </div>
                  {typeof siteMetadata.headerTitle === 'string' ? (
                    <div className="hidden h-6 text-2xl font-semibold sm:block">
                      {siteMetadata.headerTitle}
                    </div>
                  ) : (
                    siteMetadata.headerTitle
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center text-base leading-5">
              <div className="hidden sm:block">
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
              <div className="ml-1 mr-1 flex items-center sm:ml-4">
                <a className="block p-1" title="RSS" href="/feed.xml">
                  {/* RSS 图标 */}
                </a>
                <ThemeSwitch />
              </div>
              <MobileNav />
            </div>
          </div>
        </header>
        <div className="h-[var(--header-height)]" /> {/* 同步高度 */}
        <main className="mb-auto">{children}</main>
        {/* <main className="pt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            {children}
          </div>
        </main> */}
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
