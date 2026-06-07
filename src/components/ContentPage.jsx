export function PageShell({ eyebrow = 'MailRandom', title, description, children, maxWidth = 'max-w-5xl' }) {
  return (
    <section className={'mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ' + maxWidth}>
      <div className='mb-8 border-b border-ink/10 pb-8'>
        <p className='mb-3 text-xs font-black uppercase tracking-wide text-ink/45'>{eyebrow}</p>
        <h1 className='font-display text-4xl font-black leading-tight text-ink sm:text-6xl'>{title}</h1>
        {description && <p className='mt-4 max-w-3xl text-base leading-7 text-ink/68'>{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function ContentCard({ children, className = '' }) {
  return <div className={'rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-6 ' + className}>{children}</div>
}

export function ContentSection({ title, children }) {
  return (
    <section className='border-b border-ink/10 py-6 last:border-b-0 last:pb-0 first:pt-0'>
      <h2 className='font-display text-2xl font-black leading-tight text-ink'>{title}</h2>
      <div className='prose-mail mt-4'>{children}</div>
    </section>
  )
}

export function InfoTile({ icon, title, text }) {
  return (
    <div className='rounded-lg border border-ink/10 bg-paper p-4 shadow-soft'>
      <div className='mb-3 inline-grid h-10 w-10 place-items-center rounded-md bg-ink text-sm font-black text-paper'>{icon}</div>
      <h3 className='font-display text-xl font-black text-ink'>{title}</h3>
      <p className='mt-2 text-sm leading-6 text-ink/62'>{text}</p>
    </div>
  )
}
