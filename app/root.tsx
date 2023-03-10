import type { MetaFunction, LinksFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { ClientOnly } from 'remix-utils'
import Container from '~/components/Container'

import tailwind from '~/styles/tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwind },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:ital,wght@0,100;0,300;0,500;0,700;0,900;1,100;1,300;1,500;1,700;1,900&display=swap',
    },
  ]
}

export default function App() {
  return (
    <html lang="en" data-theme="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>
          {() => (
            <Container>
              <Outlet />
            </Container>
          )}
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
