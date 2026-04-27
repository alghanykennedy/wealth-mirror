import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'WealthMirror — Know How Your Mind Handles Money',
  description:
    'AI-powered behavioral finance profiler. Discover the cognitive biases silently shaping your financial decisions — before the market does.',
  openGraph: {
    title: 'WealthMirror',
    description: 'Discover your wealth psychology profile',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="bg-obsidian-950 text-white antialiased font-body">
        {children}
      </body>
    </html>
  )
}
