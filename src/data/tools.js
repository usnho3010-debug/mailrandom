export const brand = {
  name: 'MailRandom',
  slogan: 'Free Email & Web Tools for Everyone',
  contactEmail: 'support@mailrandom.com',
}

export const tools = [
  {
    title: 'Gmail Alias Generator',
    path: '/tools/gmail-alias-generator',
    description: 'Create dot and plus-address Gmail variations from one mailbox address.',
    icon: 'MailPlus',
    accent: 'teal',
  },
  {
    title: 'Microsoft / Outlook Alias Generator',
    path: '/tools/microsoft-outlook-alias-generator',
    description: 'Generate plus-address aliases for Outlook, Hotmail, Live, and Microsoft mailboxes.',
    icon: 'AtSign',
    accent: 'blue',
  },
  {
    title: 'Email Extractor Tool',
    path: '/tools/email-extractor',
    description: 'Extract, clean, sort, copy, and download email addresses from pasted text.',
    icon: 'ScanText',
    accent: 'amber',
  },
  {
    title: 'QR Code Generator',
    path: '/tools/qr-code-generator',
    description: 'Create downloadable PNG QR codes for links, text, email, phone, and Wi-Fi snippets.',
    icon: 'QrCode',
    accent: 'coral',
  },
  {
    title: 'Bulk URL Opener',
    path: '/tools/bulk-url-opener',
    description: 'Clean a list of URLs and open selected links in new tabs from your browser.',
    icon: 'ExternalLink',
    accent: 'green',
  },
]

export const primaryNav = [
  { label: 'Home', path: '/' },
  { label: 'Tools', path: '/#tools' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const legalPages = [
  { title: 'Privacy Policy', path: '/privacy-policy' },
  { title: 'Terms and Conditions', path: '/terms-and-conditions' },
  { title: 'Disclaimer', path: '/disclaimer' },
  { title: 'DMCA', path: '/dmca' },
]

export const staticPages = [
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
  ...legalPages,
  { title: 'Sitemap', path: '/sitemap' },
]

export const allRoutes = [
  { title: 'Home', path: '/' },
  ...tools,
  ...staticPages,
]

