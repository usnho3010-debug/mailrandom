import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { AppIcon, ToolCard } from '../components/ToolCard'
import { useLanguage } from '../context/useLanguage'
import { tools } from '../data/tools'

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className='mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
      <div>
        <p className='text-xs font-black uppercase tracking-wide text-ink/45'>{eyebrow}</p>
        <h2 className='mt-2 font-display text-3xl font-black leading-tight text-ink sm:text-5xl'>{title}</h2>
      </div>
      {description && <p className='max-w-xl text-sm leading-6 text-ink/62'>{description}</p>}
    </div>
  )
}

function HeroProofItem({ text }) {
  return (
    <div className='flex items-center gap-3 rounded-lg border border-ink/10 bg-white/92 p-4 shadow-soft'>
      <span className='grid h-9 w-9 place-items-center rounded-md bg-green text-white'>
        <AppIcon name='Check' className='h-4 w-4' />
      </span>
      <span className='text-sm font-black text-ink'>{text}</span>
    </div>
  )
}

export function Home() {
  const { translation } = useLanguage()
  const home = translation.home
  const localizedTools = tools.map((tool) => ({
    ...tool,
    description: home.toolDescriptions[tool.path] || tool.description,
  }))

  return (
    <>
      <Seo title={home.seoTitle} description={home.seoDescription} />

      <section className='relative overflow-hidden border-b border-ink/10 bg-paper-strong'>
        <div className='absolute left-[-9rem] top-[-10rem] h-72 w-72 rounded-full bg-amber/60 blur-3xl' />
        <div className='absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-green/25 blur-3xl' />
        <div className='absolute inset-0 bg-[linear-gradient(120deg,rgba(255,253,247,0.12),rgba(255,253,247,0.78))]' />

        <div className='relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-20'>
          <div className='max-w-4xl'>
            <p className='mb-5 inline-flex rounded-md bg-amber px-3 py-1 text-xs font-black uppercase tracking-wide text-ink shadow-brutal'>{home.badge}</p>
            <h1 className='font-display text-6xl font-black leading-[0.9] text-ink sm:text-8xl'>{home.title}</h1>
            <p className='mt-5 max-w-2xl text-xl font-black leading-8 text-ink'>{home.slogan}</p>
            <p className='mt-5 max-w-3xl text-base leading-7 text-ink/68 sm:text-lg'>{home.description}</p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <a href='#tools' className='inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-paper shadow-brutal transition hover:-translate-y-0.5 hover:bg-ink-soft'>
                <AppIcon name='ChevronRight' className='h-4 w-4' />
                {home.primaryCta}
              </a>
              <Link to='/tools/gmail-alias-generator' className='inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-paper'>
                <AppIcon name='MailPlus' className='h-4 w-4' />
                {home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className='grid gap-4 self-end'>
            <div className='rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-brutal backdrop-blur'>
              <div className='mb-5 flex items-center justify-between gap-4'>
                <div>
                  <p className='text-xs font-black uppercase tracking-wide text-ink/45'>{home.proofTitle}</p>
                  <p className='mt-1 font-display text-2xl font-black text-ink'>{home.proofMetric}</p>
                </div>
                <span className='grid h-12 w-12 place-items-center rounded-lg bg-coral text-white'>
                  <AppIcon name='Mail' className='h-6 w-6' />
                </span>
              </div>
              <div className='grid gap-3'>
                {home.proofItems.map((item) => <HeroProofItem key={item} text={item} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='tools' className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
        <SectionHeading eyebrow={home.toolsEyebrow} title={home.toolsTitle} description={home.toolsDescription} />
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {localizedTools.map((tool) => <ToolCard key={tool.path} tool={tool} actionLabel={home.openTool} />)}
        </div>
      </section>

      <section className='border-y border-ink/10 bg-white/65'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          <SectionHeading eyebrow={home.benefitsEyebrow} title={home.benefitsTitle} description={home.benefitsDescription} />
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            {home.benefits.map((benefit, index) => (
              <div key={benefit.title} className='rounded-lg border border-ink/10 bg-paper p-5 shadow-soft'>
                <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-ink font-display text-xl font-black text-paper'>{index + 1}</div>
                <h3 className='font-display text-2xl font-black text-ink'>{benefit.title}</h3>
                <p className='mt-3 text-sm leading-6 text-ink/62'>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
        <SectionHeading eyebrow={home.guideEyebrow} title={home.guideTitle} description={home.guideDescription} />
        <div className='grid gap-4 md:grid-cols-3'>
          {home.guideSteps.map((step, index) => (
            <div key={step.title} className='relative rounded-lg border border-ink/10 bg-white p-6 shadow-soft'>
              <span className='mb-5 inline-grid h-12 w-12 place-items-center rounded-lg bg-amber font-display text-2xl font-black text-ink shadow-brutal'>{index + 1}</span>
              <h3 className='font-display text-2xl font-black text-ink'>{step.title}</h3>
              <p className='mt-3 text-sm leading-6 text-ink/62'>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20'>
        <SectionHeading eyebrow={home.faqEyebrow} title={home.faqTitle} description={home.faqDescription} />
        <div className='grid gap-4 md:grid-cols-2'>
          {translation.faq.map((faq) => (
            <details key={faq.question} className='group rounded-lg border border-ink/10 bg-white p-5 shadow-soft'>
              <summary className='flex cursor-pointer list-none items-start justify-between gap-4 font-display text-xl font-black text-ink'>
                {faq.question}
                <span className='grid h-7 w-7 shrink-0 place-items-center rounded-md bg-paper text-sm transition group-open:rotate-90'>+</span>
              </summary>
              <p className='mt-4 text-sm leading-6 text-ink/62'>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
