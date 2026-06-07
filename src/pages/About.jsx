import { ContentCard, InfoTile, PageShell } from '../components/ContentPage'
import { Seo } from '../components/Seo'
import { ToolCard } from '../components/ToolCard'
import { tools } from '../data/tools'

const values = [
  { icon: '01', title: 'Free access', text: 'MailRandom is built for direct use without account gates or paid plan requirements.' },
  { icon: '02', title: 'Browser-based processing', text: 'Tool input is handled in the user browser whenever the tool can run locally.' },
  { icon: '03', title: 'Practical output', text: 'The tools focus on copy, export, download, and workflow actions users can apply immediately.' },
]

export function About() {
  return (
    <PageShell title='About MailRandom' description='MailRandom is a free email and web tools website for practical browser-based productivity tasks.' maxWidth='max-w-7xl'>
      <Seo title='About' description='About MailRandom, a free email and web tools website offering browser-based utilities for aliases, email extraction, QR codes, and bulk URL opening.' />
      <div className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
        <ContentCard>
          <div className='prose-mail'>
            <p><strong>MailRandom</strong> is a free collection of email and web tools for everyday productivity. The website helps users generate email aliases, extract email addresses from text or local files, create styled QR codes, and open batches of URLs with safer delay controls.</p>
            <p>The project is designed as a browser-first application. It has no user account system and no backend database for storing tool input. The goal is to provide focused utilities that are fast, easy to use, and suitable for mobile, tablet, and desktop browsers.</p>
            <p>MailRandom is useful for marketers, freelancers, students, support teams, QA testers, researchers, and anyone who needs quick email or web utility tasks without installing desktop software.</p>
          </div>
        </ContentCard>

        <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
          {values.map((value) => <InfoTile key={value.title} {...value} />)}
        </div>
      </div>

      <section className='mt-10'>
        <div className='mb-5'>
          <p className='text-xs font-black uppercase tracking-wide text-ink/45'>MailRandom Toolbox</p>
          <h2 className='mt-2 font-display text-3xl font-black text-ink'>Free email and web tools</h2>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-ink/62'>Each tool is designed for a specific task and includes practical actions such as copy, export, download, filtering, or browser-based opening.</p>
        </div>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {tools.map((tool) => <ToolCard key={tool.path} tool={tool} />)}
        </div>
      </section>
    </PageShell>
  )
}
