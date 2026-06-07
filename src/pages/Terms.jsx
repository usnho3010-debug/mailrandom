import { ContentCard, ContentSection, PageShell } from '../components/ContentPage'
import { Seo } from '../components/Seo'
import { brand } from '../data/tools'

export function Terms() {
  return (
    <PageShell title='Terms and Conditions' description='Rules for using MailRandom free email and web tools responsibly.'>
      <Seo title='Terms and Conditions' description='MailRandom Terms and Conditions covering acceptable use, prohibited spam, scam, hacking, unauthorized data collection, and user responsibility.' />
      <ContentCard>
        <div className='prose-mail'>
          <p><strong>Last updated:</strong> June 7, 2026</p>
          <p>These Terms and Conditions govern access to and use of MailRandom, a free website offering browser-based email and web utility tools. By using MailRandom, you agree to these terms.</p>
        </div>

        <ContentSection title='1. Service description'>
          <p>MailRandom provides tools such as email alias generators, an email extractor, a QR code generator, and a bulk URL opener. The tools are provided for productivity, formatting, testing, research, and everyday web utility tasks.</p>
          <p>MailRandom does not provide an account system, backend database, or managed storage for user tool output.</p>
        </ContentSection>

        <ContentSection title='2. Acceptable use'>
          <p>You may use MailRandom for lawful personal, educational, testing, operational, and business utility purposes. You are responsible for reviewing generated output before using it.</p>
        </ContentSection>

        <ContentSection title='3. Prohibited use'>
          <p>You must not use MailRandom or any generated output for illegal, abusive, deceptive, or harmful activity. Prohibited activity includes, without limitation:</p>
          <ul>
            <li>Spam, unsolicited bulk messaging, or abusive email activity.</li>
            <li>Scams, phishing, impersonation, fraud, or deceptive campaigns.</li>
            <li>Hacking, credential theft, malware distribution, or attempts to bypass security controls.</li>
            <li>Unauthorized scraping, harvesting, or collection of personal data.</li>
            <li>Violation of email provider rules, platform policies, intellectual property rights, privacy rights, or applicable law.</li>
            <li>Opening unsafe links or causing nuisance, disruption, or harm to other users, systems, or networks.</li>
          </ul>
        </ContentSection>

        <ContentSection title='4. User responsibility'>
          <p>You are solely responsible for the content you paste into tools, the files you load locally, the output you generate, the links you open, and the decisions you make based on tool results.</p>
          <p>You must verify that your use of MailRandom is allowed by your organization, service providers, and local laws.</p>
        </ContentSection>

        <ContentSection title='5. No warranties'>
          <p>MailRandom is provided on an as-is and as-available basis. The tools may contain errors, produce unexpected output, or behave differently across browsers and devices.</p>
          <p>MailRandom does not guarantee uninterrupted access, perfect accuracy, compatibility with every provider, or suitability for any specific purpose.</p>
        </ContentSection>

        <ContentSection title='6. Third-party platforms and provider rules'>
          <p>Email alias behavior depends on email providers and account settings. QR scanning depends on scanner apps and destination systems. Bulk URL opening depends on browser pop-up and tab policies. You are responsible for complying with third-party rules.</p>
        </ContentSection>

        <ContentSection title='7. Intellectual property'>
          <p>The MailRandom name, original website content, interface design, and source code are provided as part of this project unless otherwise stated. You may not copy the MailRandom brand identity in a way that causes confusion or misrepresents affiliation.</p>
        </ContentSection>

        <ContentSection title='8. Changes to the website and terms'>
          <p>MailRandom may add, remove, change, or discontinue tools and content at any time. These Terms may also be updated. Continued use after updates means you accept the current version.</p>
        </ContentSection>

        <ContentSection title='9. Contact'>
          <p>Questions about these Terms can be sent to <a href={'mailto:' + brand.contactEmail}>{brand.contactEmail}</a>.</p>
        </ContentSection>
      </ContentCard>
    </PageShell>
  )
}
