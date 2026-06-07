import { ContentCard, ContentSection, PageShell } from '../components/ContentPage'
import { Seo } from '../components/Seo'
import { brand } from '../data/tools'

export function PrivacyPolicy() {
  return (
    <PageShell title='Privacy Policy' description='How MailRandom handles privacy for free browser-based email and web tools.'>
      <Seo title='Privacy Policy' description='MailRandom Privacy Policy explaining no account requirement, local browser processing, no tool data storage, hosting logs, and user privacy choices.' />
      <ContentCard>
        <div className='prose-mail'>
          <p><strong>Last updated:</strong> June 7, 2026</p>
          <p>MailRandom provides free email and web tools that are designed to run in the visitor browser. This Privacy Policy explains what data is processed, what is not stored by MailRandom, and what users should understand before using any online utility.</p>
        </div>

        <ContentSection title='1. No account required'>
          <p>MailRandom does not require users to create an account, log in, register a profile, or provide a password to use the tools. The website is intended for direct access without signup.</p>
        </ContentSection>

        <ContentSection title='2. Tool data is processed in your browser'>
          <p>The core tools process input locally in the browser whenever technically possible. Examples include generated email aliases, pasted text for email extraction, QR code payloads, uploaded local files, and URL lists for the Bulk URL Opener.</p>
          <p>MailRandom does not operate a backend database for storing tool input or generated tool output. Your pasted content and generated results are not intentionally sent to a MailRandom application server for processing.</p>
        </ContentSection>

        <ContentSection title='3. Local files and uploads'>
          <p>When a tool lets you upload a TXT, CSV, JSON, DOCX, image, or other supported file, the file is read by browser-side JavaScript for that tool. The upload control does not mean the file is uploaded to a MailRandom server.</p>
          <p>You should still avoid placing highly confidential, regulated, or sensitive information into any online tool unless you understand the device, browser, extensions, network, and hosting environment you are using.</p>
        </ContentSection>

        <ContentSection title='4. Clipboard, downloads, and browser storage'>
          <p>Some tools can copy output to your clipboard or create downloadable files such as TXT, CSV, JSON, PDF, DOCX, PNG, or SVG. These actions happen through browser features controlled by your device and browser permissions.</p>
          <p>MailRandom may use local browser storage for basic site preferences, such as the selected language. This preference is stored on your device and is not a user account.</p>
        </ContentSection>

        <ContentSection title='5. Hosting logs and technical data'>
          <p>If MailRandom is hosted by a third-party hosting provider, that provider may process standard technical logs for security, delivery, troubleshooting, and abuse prevention. Logs may include IP address, user agent, requested URL, referrer, time of request, and similar technical metadata.</p>
          <p>These logs are separate from tool input. MailRandom does not use hosting logs to reconstruct pasted tool content.</p>
        </ContentSection>

        <ContentSection title='6. Cookies and tracking'>
          <p>MailRandom is built as a simple client-side tool website. The current app does not require tracking cookies to use the tools. If analytics, advertising, or third-party embeds are added in the future, this policy should be updated to describe those services.</p>
        </ContentSection>

        <ContentSection title='7. Third-party libraries'>
          <p>MailRandom may use open-source browser libraries to perform tasks such as QR code generation, document reading, PDF generation, or DOCX export. These libraries run as part of the website code loaded in your browser.</p>
        </ContentSection>

        <ContentSection title='8. Children privacy'>
          <p>MailRandom is not designed to knowingly collect personal information from children. Because no account system is provided, users should not submit personal information through tool inputs unless they have permission and understand the context.</p>
        </ContentSection>

        <ContentSection title='9. Changes to this Privacy Policy'>
          <p>MailRandom may update this Privacy Policy when tools, hosting, legal requirements, or site features change. The updated version will be posted on this page with a new last updated date.</p>
        </ContentSection>

        <ContentSection title='10. Contact'>
          <p>Questions about this Privacy Policy can be sent to <a href={'mailto:' + brand.contactEmail}>{brand.contactEmail}</a>.</p>
        </ContentSection>
      </ContentCard>
    </PageShell>
  )
}
