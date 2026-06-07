import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brand, tools } from '../data/tools'
import { useLanguage } from '../context/useLanguage'
import { AppIcon } from './ToolCard'

function BrandMark() {
  return <span className='grid h-11 w-11 place-items-center rounded-lg bg-ink text-sm font-black text-paper shadow-brutal'>MR</span>
}

function BrandLink({ onClick }) {
  const { translation } = useLanguage()

  return (
    <Link to='/' className='flex min-w-0 items-center gap-3' aria-label='MailRandom home' onClick={onClick}>
      <BrandMark />
      <span className='min-w-0'>
        <span className='block font-display text-xl font-black leading-5 text-ink'>{brand.name}</span>
        <span className='hidden text-xs font-bold uppercase text-ink/55 sm:block'>{translation.home.slogan}</span>
      </span>
    </Link>
  )
}

function navClass({ isActive }) {
  return 'rounded-md px-3 py-2 text-sm font-bold transition ' + (isActive ? 'bg-ink text-paper' : 'text-ink/75 hover:bg-ink/8 hover:text-ink')
}

function NavItem({ item, onNavigate }) {
  if (item.path.includes('#')) {
    return (
      <Link className='rounded-md px-3 py-2 text-sm font-bold text-ink/75 transition hover:bg-ink/8 hover:text-ink' to={item.path} onClick={onNavigate}>
        {item.label}
      </Link>
    )
  }

  return (
    <NavLink to={item.path} className={navClass} end={item.path === '/'} onClick={onNavigate}>
      {item.label}
    </NavLink>
  )
}

function LanguageToggle({ className = '' }) {
  const { language, toggleLanguage, translation } = useLanguage()
  const nextLabel = language === 'en' ? 'Tiếng Việt' : 'English'

  return (
    <button className={'inline-flex min-h-10 items-center justify-center rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-black text-ink transition hover:bg-paper-strong ' + className} type='button' onClick={toggleLanguage} aria-label={'Switch language to ' + nextLabel}>
      {translation.languageShort} / {translation.switchTo}
    </button>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { translation } = useLanguage()
  const navItems = useMemo(() => [
    { label: translation.nav.home, path: '/' },
    { label: translation.nav.tools, path: '/#tools' },
    { label: translation.nav.about, path: '/about' },
    { label: translation.nav.contact, path: '/contact' },
  ], [translation])

  return (
    <header className='sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <BrandLink onClick={() => setOpen(false)} />
        <nav className='hidden items-center gap-1 lg:flex' aria-label='Main navigation'>
          {navItems.map((item) => <NavItem key={item.path} item={item} />)}
        </nav>
        <div className='hidden items-center gap-2 md:flex'>
          <LanguageToggle />
          <Link to='/tools/email-extractor' className='rounded-md bg-coral px-4 py-2 text-sm font-black text-white shadow-brutal transition hover:-translate-y-0.5 hover:bg-coral-dark'>{translation.nav.startTool}</Link>
        </div>
        <button className='inline-grid h-11 w-11 place-items-center rounded-md border border-ink/15 bg-white text-ink lg:hidden' type='button' aria-label={translation.nav.menu} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <AppIcon name={open ? 'X' : 'Menu'} />
        </button>
      </div>

      {open && (
        <div className='border-t border-ink/10 bg-paper px-4 py-4 shadow-xl lg:hidden'>
          <nav className='mx-auto grid max-w-7xl gap-2' aria-label='Mobile navigation'>
            {navItems.map((item) => <NavItem key={item.path} item={item} onNavigate={() => setOpen(false)} />)}
            <div className='mt-2 grid grid-cols-2 gap-2 md:hidden'>
              <LanguageToggle className='w-full' />
              <Link to='/tools/email-extractor' className='inline-flex min-h-10 items-center justify-center rounded-md bg-coral px-3 py-2 text-sm font-black text-white shadow-brutal' onClick={() => setOpen(false)}>{translation.nav.startTool}</Link>
            </div>
            <div className='mt-3 grid gap-2 border-t border-ink/10 pt-3'>
              {tools.map((tool) => (
                <Link key={tool.path} to={tool.path} className='flex items-center justify-between rounded-md bg-white px-3 py-3 text-sm font-bold text-ink shadow-soft' onClick={() => setOpen(false)}>
                  {tool.title}
                  <AppIcon name='ChevronRight' className='h-4 w-4' />
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}



