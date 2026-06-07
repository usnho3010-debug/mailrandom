import { Link } from 'react-router-dom'
import { ContentCard, PageShell } from '../components/ContentPage'
import { AppIcon } from '../components/ToolCard'
import { Seo } from '../components/Seo'
import { legalPages, staticPages, tools } from '../data/tools'

const mainPages = [
  { title: 'Home', path: '/', description: 'MailRandom homepage with tool cards, benefits, FAQ, and usage guide.' },
  { title: 'About', path: '/about', description: 'Learn about MailRandom and the free email and web tools.' },
  { title: 'Contact', path: '/contact', description: 'Contact MailRandom at support@mailrandom.com.' },
]

function RouteGroup({ title, routes }) {
  return (
    <ContentCard>
      <h2 className='font-display text-2xl font-black text-ink'>{title}</h2>
      <div className='mt-4 grid gap-3'>
        {routes.map((route) => (
          <Link key={route.path} to={route.path} className='group flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft'>
            <span>
              <span className='block text-sm font-black text-ink'>{route.title}</span>
              {route.description && <span className='mt-1 block text-xs leading-5 text-ink/55'>{route.description}</span>}
            </span>
            <AppIcon name='ChevronRight' className='h-4 w-4 shrink-0 text-ink/35 transition group-hover:translate-x-1 group-hover:text-ink' />
          </Link>
        ))}
      </div>
    </ContentCard>
  )
}

export function Sitemap() {
  const legalRoutes = legalPages.map((page) => ({ ...page, description: 'Legal information and policy page for MailRandom.' }))
  const utilityRoutes = tools.map((tool) => ({ title: tool.title, path: tool.path, description: tool.description }))
  const otherStatic = staticPages.filter((page) => !['/about', '/contact', ...legalPages.map((legal) => legal.path)].includes(page.path))

  return (
    <PageShell title='Sitemap' description='Browse every MailRandom page, legal policy, and free email or web tool.' maxWidth='max-w-7xl'>
      <Seo title='Sitemap' description='MailRandom sitemap listing all free tools, main pages, legal pages, contact page, about page, and policy documents.' />
      <div className='grid gap-6 lg:grid-cols-3'>
        <RouteGroup title='Main pages' routes={[...mainPages, ...otherStatic]} />
        <RouteGroup title='Tools' routes={utilityRoutes} />
        <RouteGroup title='Legal pages' routes={legalRoutes} />
      </div>
    </PageShell>
  )
}
