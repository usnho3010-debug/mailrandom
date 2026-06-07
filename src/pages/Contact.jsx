import { useMemo, useState } from 'react'
import { ContentCard, InfoTile, PageShell } from '../components/ContentPage'
import { AppIcon } from '../components/ToolCard'
import { Seo } from '../components/Seo'
import { brand } from '../data/tools'

const contactReasons = [
  { icon: 'Q', title: 'General questions', text: 'Ask about MailRandom tools, usage, or browser-based processing.' },
  { icon: 'B', title: 'Bug reports', text: 'Report broken UI, export issues, browser compatibility problems, or incorrect tool behavior.' },
  { icon: 'C', title: 'Copyright concerns', text: 'Send copyright or DMCA-related messages with enough detail for review.' },
]

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const mailto = useMemo(() => {
    const subject = encodeURIComponent('MailRandom contact request')
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)
    return 'mailto:' + brand.contactEmail + '?subject=' + subject + '&body=' + body
  }, [name, email, message])

  return (
    <PageShell title='Contact MailRandom' description='Contact MailRandom for questions, feedback, bug reports, and copyright concerns.'>
      <Seo title='Contact' description='Contact MailRandom at support@mailrandom.com for questions, feedback, bug reports, tool issues, and copyright concerns.' />
      <div className='grid gap-6 lg:grid-cols-[0.85fr_1.15fr]'>
        <div className='grid gap-4'>
          <ContentCard>
            <AppIcon name='Mail' className='mb-4 h-8 w-8 text-coral' />
            <h2 className='font-display text-2xl font-black text-ink'>Email support</h2>
            <p className='mt-3 text-sm leading-6 text-ink/65'>MailRandom does not use a backend contact form. The form on this page prepares an email locally and opens your email app.</p>
            <a className='mt-5 inline-flex rounded-md bg-ink px-4 py-3 text-sm font-black text-paper' href={'mailto:' + brand.contactEmail}>{brand.contactEmail}</a>
          </ContentCard>
          {contactReasons.map((item) => <InfoTile key={item.title} {...item} />)}
        </div>

        <form className='rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-6'>
          <div className='mb-5'>
            <p className='text-xs font-black uppercase tracking-wide text-ink/45'>Local mail form</p>
            <h2 className='mt-2 font-display text-3xl font-black text-ink'>Prepare an email</h2>
            <p className='mt-3 text-sm leading-6 text-ink/62'>Nothing is submitted to a MailRandom server. Your browser will open a mailto link with the message you enter.</p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-black text-ink' htmlFor='contact-name'>Name</label>
              <input id='contact-name' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-coral focus:ring-4 focus:ring-coral/15' value={name} onChange={(event) => setName(event.target.value)} placeholder='Your name' />
            </div>
            <div>
              <label className='mb-2 block text-sm font-black text-ink' htmlFor='contact-email'>Email</label>
              <input id='contact-email' type='email' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-coral focus:ring-4 focus:ring-coral/15' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='you@example.com' />
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-2 block text-sm font-black text-ink' htmlFor='contact-message'>Message</label>
            <textarea id='contact-message' className='min-h-48 w-full resize-y rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-coral focus:ring-4 focus:ring-coral/15' value={message} onChange={(event) => setMessage(event.target.value)} placeholder='Tell us what you need help with.' />
          </div>
          <a className='mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-black text-white shadow-brutal' href={mailto}>
            <AppIcon name='ExternalLink' className='h-4 w-4' />
            Open email app
          </a>
        </form>
      </div>
    </PageShell>
  )
}

