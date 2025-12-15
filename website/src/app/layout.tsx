import { Layout } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import PostHog from '@/components/Posthog'
import { metadata as metadataObject } from './metadata'
import Link from 'next/link'

const navbar = <NavBar />
const footer = <Footer />
const banner = <Banner storageKey="alpha"><Link href="https://discord.gg/34K4t5K9Ra">🚀 <b>Legit SDK Alpha</b> preview – help shape it on Discord <u>here.</u></Link></Banner>

const filteredPageMap = async () => {
  const pageMap = await getPageMap()
  const filteredPageMap = pageMap.filter((page) => (page as { route: string }).route !== '/')
  return filteredPageMap
}

export const metadata = metadataObject;
 
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        // primary color for nextra theme
        color={{
          hue: 21,
          saturation: 100,
          lightness: 55
        }}
        
      // ... Your additional head options
      >
        <meta name="color-scheme" content="only light" />
        <link rel="preload" href="/fonts/GeistMono/GeistMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body>
        <PostHog>
          <Layout
            navbar={navbar}
            pageMap={await filteredPageMap()}
            docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
            footer={footer}
            darkMode={false}
            nextThemes={{ forcedTheme: 'light' }}
            editLink={null}
            banner={banner}
            feedback={{
              link: 'https://discord.gg/34K4t5K9Ra'
            }}
            sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: false }}
          >
            {children}
          </Layout>
        </PostHog>
      </body>
    </html>
  )
}