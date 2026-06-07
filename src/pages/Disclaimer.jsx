import { ContentCard, ContentSection, PageShell } from '../components/ContentPage'
import { Seo } from '../components/Seo'
import { brand } from '../data/tools'

export function Disclaimer() {
  return (
    <PageShell title='Disclaimer' description='Important limitations and user responsibility notices for MailRandom tools.'>
      <Seo title='Disclaimer' description='MailRandom disclaimer explaining user responsibility, no warranties, provider differences, external links, QR codes, and browser-based tool limitations.' />
      <ContentCard>
        <div className='prose-mail'>
          <p><strong>Last updated:</strong> June 7, 2026</p>
          <p>MailRandom offers free browser-based email and web tools for convenience and productivity. This Disclaimer explains the limits of the website and the responsibility of each user.</p>
        </div>

        <ContentSection title='1. User responsibility'>
          <p>You are responsible for how you use MailRandom, what information you enter, what results you generate, and what actions you take based on those results. Review all output before using it in real workflows.</p>
        </ContentSection>

        <ContentSection title='2. No professional advice'>
          <p>MailRandom does not provide legal, security, compliance, privacy, marketing, financial, or professional advice. The tools are utilities only. If your use case has legal, security, or compliance impact, consult a qualified professional.</p>
        </ContentSection>

        <ContentSection title='3. No warranty of accuracy or availability'>
          <p>MailRandom is provided as-is without warranties of accuracy, completeness, reliability, availability, merchantability, or fitness for a particular purpose. Tools may produce incorrect, incomplete, or unexpected results.</p>
        </ContentSection>

        <ContentSection title='4. Email alias limitations'>
          <p>Email alias support varies by provider, domain, account configuration, organization policies, spam filters, and receiving systems. Always test aliases before relying on them for important communication or production workflows.</p>
        </ContentSection>

        <ContentSection title='5. Email extraction and generated output'>
          <p>The Email Extractor may miss some valid addresses or include addresses that require review. Cleaning, filtering, and classification features are best-effort utilities and should not be treated as final verification.</p>
        </ContentSection>

        <ContentSection title='6. QR codes and external links'>
          <p>QR codes should be tested with the scanner apps and devices you expect users to use. Bulk URL opening and external links may be blocked by browsers or may lead to third-party websites outside MailRandom control.</p>
        </ContentSection>

        <ContentSection title='7. Local processing is not a security guarantee'>
          <p>MailRandom tools are designed to process data in the browser, but local processing does not guarantee confidentiality if your device, browser, extensions, network, or hosting environment is compromised. Do not enter sensitive information unless you understand the risks.</p>
        </ContentSection>

        <ContentSection title='8. Contact'>
          <p>Questions about this Disclaimer can be sent to <a href={'mailto:' + brand.contactEmail}>{brand.contactEmail}</a>.</p>
        </ContentSection>
      </ContentCard>
    </PageShell>
  )
}
