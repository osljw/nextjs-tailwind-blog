import React from 'react'

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
        {children}
      </body>
    </html>
  )
}
