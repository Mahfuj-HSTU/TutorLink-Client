import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/providers/ReduxProvider'
import { Toaster } from 'react-hot-toast'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: { default: 'TutorLink', template: '%s | TutorLink' },
  description:
    'Connect with expert tutors for personalised, flexible learning — online or in person.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${geist.variable} h-full antialiased`}>
      <body className='min-h-full bg-white font-sans text-slate-900'>
        <ReduxProvider>
          {children}
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                fontSize: '14px'
              }
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  )
}
