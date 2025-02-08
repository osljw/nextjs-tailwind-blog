import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'

export const metadata = {
  title: 'web title',
  description: 'description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
      // className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white"
      >
        {/* {children} */}
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
