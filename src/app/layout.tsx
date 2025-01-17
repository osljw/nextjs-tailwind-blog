import React from 'react'

export const metadata = {
  title: 'web title',
  description: 'description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
