import { ContentCard, ContentSection, PageShell } from '../components/ContentPage'
import { Seo } from '../components/Seo'
import { brand } from '../data/tools'

export function Dmca() {
  return (
    <PageShell title='DMCA Policy' description='How to contact MailRandom about copyright complaints and takedown requests.'>
      <Seo title='DMCA' description='MailRandom DMCA Policy with copyright complaint instructions, takedown notice requirements, counter-notice information, and contact email.' />
      <ContentCard>
        <div className='prose-mail'>
          <p><strong>Last updated:</strong> June 7, 2026</p>
          <p>MailRandom respects intellectual property rights and responds to copyright concerns. If you believe material available on MailRandom infringes your copyright, you may send a copyright complaint to the contact below.</p>
        </div>

        <ContentSection title='1. Copyright contact'>
          <p>Email copyright complaints to <a href={'mailto:' + brand.contactEmail}>{brand.contactEmail}</a>. Use a clear subject line such as <strong>DMCA Notice - MailRandom</strong>.</p>
        </ContentSection>

        <ContentSection title='2. Information to include in a notice'>
          <p>To help MailRandom review your complaint, include the following information:</p>
          <ol>
            <li>Your full name, organization if applicable, mailing address, phone number, and email address.</li>
            <li>A description of the copyrighted work you claim has been infringed.</li>
            <li>The exact URL or location of the material on MailRandom that you believe is infringing.</li>
            <li>A statement that you have a good-faith belief the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in your notice is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act for the owner.</li>
            <li>Your physical or electronic signature.</li>
          </ol>
        </ContentSection>

        <ContentSection title='3. Review process'>
          <p>MailRandom may review complete notices and may remove, disable, or restrict access to material where appropriate. Incomplete notices may be difficult to process.</p>
        </ContentSection>

        <ContentSection title='4. Counter-notices'>
          <p>If material you posted or control was removed because of a copyright complaint and you believe removal was a mistake, you may contact MailRandom with a counter-notice. Include enough detail to identify the removed material and explain why you believe the removal was incorrect.</p>
        </ContentSection>

        <ContentSection title='5. Misrepresentation'>
          <p>Copyright notices and counter-notices can have legal consequences. Do not submit false, misleading, or bad-faith claims. You are responsible for the accuracy of the information you provide.</p>
        </ContentSection>

        <ContentSection title='6. Repeat infringement'>
          <p>MailRandom may restrict or remove access to content or features where repeat infringement or abusive copyright complaints are identified.</p>
        </ContentSection>
      </ContentCard>
    </PageShell>
  )
}
