import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js PWA',
  description: 'A Progressive Web App built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
