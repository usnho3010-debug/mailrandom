import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Disclaimer } from './pages/Disclaimer'
import { Dmca } from './pages/Dmca'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Sitemap } from './pages/Sitemap'
import { Terms } from './pages/Terms'
import { BulkUrlOpener } from './tools/BulkUrlOpener'
import { EmailExtractor } from './tools/EmailExtractor'
import { GmailAliasGenerator } from './tools/GmailAliasGenerator'
import { MicrosoftAliasGenerator } from './tools/MicrosoftAliasGenerator'
import { QrCodeGenerator } from './tools/QrCodeGenerator'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index={true} element={<Home />} />
        <Route path='tools' element={<Navigate to='/#tools' replace={true} />} />
        <Route path='tools/gmail-alias-generator' element={<GmailAliasGenerator />} />
        <Route path='tools/microsoft-outlook-alias-generator' element={<MicrosoftAliasGenerator />} />
        <Route path='tools/email-extractor' element={<EmailExtractor />} />
        <Route path='tools/qr-code-generator' element={<QrCodeGenerator />} />
        <Route path='tools/bulk-url-opener' element={<BulkUrlOpener />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} />
        <Route path='terms-and-conditions' element={<Terms />} />
        <Route path='disclaimer' element={<Disclaimer />} />
        <Route path='dmca' element={<Dmca />} />
        <Route path='sitemap' element={<Sitemap />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

