import { Link } from 'react-router-dom'
import { brand, legalPages, tools } from '../data/tools'
import { useLanguage } from '../context/useLanguage'

function BrandMark() {
  return <span className='grid h-10 w-10 place-items-center rounded-lg bg-ink text-xs font-black text-paper shadow-brutal'>MR</span>
}

export function Footer() {
  const { language, translation, toggleLanguage } = useLanguage()

  return (
    <footer className='border-t border-ink/10 bg-ink text-paper'>
      <div className='mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] lg:px-8'>
        <div>
          <div className='mb-4 flex items-center gap-3'>
            <span className='rounded-lg bg-paper p-1'><BrandMark /></span>
            <div>
              <p className='font-display text-xl font-black'>{brand.name}</p>
              <p className='text-sm text-paper/65'>{translation.home.slogan}</p>
            </div>
          </div>
          <p className='max-w-md text-sm leading-6 text-paper/70'>{translation.footer.description}</p>
          <div className='mt-5 rounded-lg border border-paper/10 bg-paper/8 p-3'>
            <p className='text-xs font-black uppercase tracking-wide text-paper/45'>{translation.footer.language}</p>
            <button className='mt-2 inline-flex rounded-md bg-paper px-3 py-2 text-sm font-black text-ink transition hover:bg-paper-strong' type='button' onClick={toggleLanguage}>
              {language === 'en' ? 'English / Tiếng Việt' : 'Tiếng Việt / English'}
            </button>
          </div>
        </div>

        <div>
          <h2 className='mb-4 text-sm font-black uppercase text-paper/55'>{translation.footer.tools}</h2>
          <div className='grid gap-2'>
            {tools.map((tool) => (
              <Link key={tool.path} to={tool.path} className='text-sm font-bold text-paper/80 hover:text-paper'>{tool.title}</Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className='mb-4 text-sm font-black uppercase text-paper/55'>{translation.footer.site}</h2>
          <div className='grid gap-2'>
            <Link to='/' className='text-sm font-bold text-paper/80 hover:text-paper'>{translation.footer.home}</Link>
            <Link to='/#tools' className='text-sm font-bold text-paper/80 hover:text-paper'>{translation.nav.tools}</Link>
            <Link to='/about' className='text-sm font-bold text-paper/80 hover:text-paper'>{translation.nav.about}</Link>
            <Link to='/contact' className='text-sm font-bold text-paper/80 hover:text-paper'>{translation.nav.contact}</Link>
            <Link to='/sitemap' className='text-sm font-bold text-paper/80 hover:text-paper'>{translation.footer.sitemap}</Link>
          </div>
        </div>

        <div>
          <h2 className='mb-4 text-sm font-black uppercase text-paper/55'>{translation.footer.legal}</h2>
          <div className='grid gap-2'>
            {legalPages.map((page) => (
              <Link key={page.path} to={page.path} className='text-sm font-bold text-paper/80 hover:text-paper'>{page.title}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className='border-t border-paper/10 px-4 py-4 text-center text-xs font-bold text-paper/50'>
        © {new Date().getFullYear()} {brand.name}. {translation.footer.rights}
      </div>
    </footer>
  )
}



