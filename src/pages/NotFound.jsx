import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export function NotFound() {
  return (
    <section className='mx-auto grid min-h-[60vh] max-w-4xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8'>
      <Seo title='404 Not Found' description='The requested MailRandom page could not be found. Use the homepage or sitemap to find available tools.' />
      <div>
        <p className='mb-3 text-xs font-black uppercase text-ink/45'>404 Not Found</p>
        <h1 className='font-display text-5xl font-black text-ink sm:text-7xl'>Page not found</h1>
        <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-ink/65'>The page may have moved, or the URL may be incorrect.</p>
        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <Link to='/' className='inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-black text-paper'>Go home</Link>
          <Link to='/sitemap' className='inline-flex min-h-11 items-center justify-center rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-black text-ink'>View sitemap</Link>
        </div>
      </div>
    </section>
  )
}

