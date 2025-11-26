import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { type ReactNode } from 'react'

import '@fontsource/plus-jakarta-sans/latin.css'

import Header from '../components/Header'
import { Footer } from '../components/Footer'
import { ThemeProvider } from '../components/ThemeProvider'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Personal Website - Riyaldi',
      },
      {
        name: 'description',
        content: 'Personal portfolio and website of Riyaldi. Undergraduate Computer Science specializing in Android Development, Fullstack Development, and Machine Learning. Explore my projects, blog, and professional journey.',
      },
      {
        name: 'keywords',
        content: 'Riyaldi, Portfolio, Web Developer, Web Development, Fullstack Development, Android Development, Machine Learning Engineer, Sukoharjo, Surakarta, Personal Website',
      },
      {
        name: 'author',
        content: 'Riyaldi',
      },
      // --- Open Graph / Facebook / LinkedIn ---
      {
        property: 'og:title',
        content: 'Personal Website - Riyaldi',
      },
      {
        property: 'og:description',
        content: 'Personal portfolio of Riyaldi. View my latest projects and articles.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      { 
        property: 'og:image', 
        content: '/img/website.webp' 
      }, 
      
      // --- Twitter ---
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Personal Website - Riyaldi',
      },
      {
        name: 'twitter:description',
        content: 'Personal portfolio of Riyaldi. View my latest projects and articles.',
      },
      { 
        name: 'twitter:image', 
        content: '/img/website.webp' 
      }, 
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
