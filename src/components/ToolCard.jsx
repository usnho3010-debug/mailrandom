import { Link } from 'react-router-dom'
import {
  AtSign,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MailPlus,
  Menu,
  QrCode,
  ScanText,
  X,
} from 'lucide-react'

const icons = {
  AtSign,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MailPlus,
  Menu,
  QrCode,
  ScanText,
  X,
}

const accentMap = {
  teal: 'bg-teal text-white',
  blue: 'bg-blue text-white',
  amber: 'bg-amber text-ink',
  coral: 'bg-coral text-white',
  green: 'bg-green text-white',
}

export function AppIcon({ name, className = 'h-5 w-5', ...props }) {
  const Icon = icons[name] || Mail
  return <Icon className={className} aria-hidden={true} {...props} />
}

export function ToolCard({ tool, actionLabel = 'Open Tool' }) {
  return (
    <Link key={tool.path} to={tool.path} className='group flex min-h-full flex-col rounded-lg border border-ink/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-brutal'>
      <div className='mb-5 flex items-start justify-between gap-4'>
        <span className={(accentMap[tool.accent] || accentMap.teal) + ' grid h-12 w-12 place-items-center rounded-lg'}>
          <AppIcon name={tool.icon} className='h-6 w-6' />
        </span>
        <AppIcon name='ChevronRight' className='h-5 w-5 text-ink/30 transition group-hover:translate-x-1 group-hover:text-ink' />
      </div>
      <h3 className='font-display text-2xl font-black leading-tight text-ink'>{tool.title}</h3>
      <p className='mt-3 flex-1 text-sm leading-6 text-ink/62'>{tool.description}</p>
      <span className='mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-black text-paper transition group-hover:bg-coral'>
        {actionLabel}
        <AppIcon name='ExternalLink' className='h-4 w-4' />
      </span>
    </Link>
  )
}

export function ToolShell({ title, description, icon, accent = 'teal', children, aside }) {
  return (
    <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
      <div className='mb-7 flex flex-col gap-5 border-b border-ink/10 pb-7 md:flex-row md:items-end md:justify-between'>
        <div className='flex max-w-3xl gap-4'>
          <div className={(accentMap[accent] || accentMap.teal) + ' grid h-14 w-14 shrink-0 place-items-center rounded-lg shadow-brutal'}>
            <AppIcon name={icon} className='h-7 w-7' />
          </div>
          <div>
            <p className='mb-2 text-xs font-black uppercase tracking-wide text-ink/45'>MailRandom Tool</p>
            <h1 className='font-display text-3xl font-black leading-tight text-ink sm:text-5xl'>{title}</h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-ink/68'>{description}</p>
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className='mb-2 block text-sm font-black text-ink'>
      {children}
    </label>
  )
}

export function ActionButton({ children, icon, variant = 'primary', className = '', ...props }) {
  const styles = variant === 'secondary' ? 'border border-ink/15 bg-white text-ink hover:bg-paper-strong' : 'bg-ink text-paper hover:bg-ink-soft'

  return (
    <button className={styles + ' inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ' + className} type='button' {...props}>
      {icon && <AppIcon name={icon} className='h-4 w-4' />}
      {children}
    </button>
  )
}

export function ResultBox({ children, className = '' }) {
  return <div className={'rounded-lg border border-ink/10 bg-white p-4 shadow-soft ' + className}>{children}</div>
}

export function EmptyState({ icon = 'FileText', title, text }) {
  return (
    <div className='grid min-h-56 place-items-center rounded-lg border border-dashed border-ink/20 bg-paper/70 p-8 text-center'>
      <div>
        <AppIcon name={icon} className='mx-auto mb-3 h-9 w-9 text-ink/35' />
        <p className='font-display text-xl font-black text-ink'>{title}</p>
        <p className='mt-2 max-w-md text-sm leading-6 text-ink/60'>{text}</p>
      </div>
    </div>
  )
}

