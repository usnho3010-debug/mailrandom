export const QR_TYPES = [
  { value: 'website', label: 'Website URL' },
  { value: 'text', label: 'Plain Text' },
  { value: 'wifi', label: 'WiFi Network' },
  { value: 'whatsapp', label: 'WhatsApp Message' },
  { value: 'vcard', label: 'VCard Contact' },
  { value: 'email', label: 'Email Message' },
  { value: 'sms', label: 'SMS Message' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'calendar', label: 'Calendar Event' },
  { value: 'geo', label: 'Geo Location' },
  { value: 'twitter', label: 'Twitter/X Profile' },
  { value: 'instagram', label: 'Instagram Profile' },
  { value: 'youtube', label: 'YouTube Video' },
  { value: 'facebook', label: 'Facebook Page' },
  { value: 'skype', label: 'Skype ID' },
  { value: 'zoom', label: 'Zoom Meeting Link' },
]

export const dotStyleOptions = ['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded']
export const cornerSquareStyleOptions = ['square', 'dot', 'extra-rounded', 'rounded', 'classy', 'classy-rounded']
export const cornerDotStyleOptions = ['square', 'dot', 'rounded', 'dots', 'classy', 'classy-rounded']
export const errorCorrectionOptions = ['L', 'M', 'Q', 'H']

export function normalizeQrUrl(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed
}

export function escapeWifiValue(value) {
  return String(value || '').replace(/([\\;,:])/g, '\\$1')
}

function cleanHandle(value) {
  return String(value || '').trim().replace(/^@/, '').replace(/^https?:\/\/[^/]+\//i, '').split(/[/?#]/)[0]
}

function compactPhone(value) {
  return String(value || '').replace(/[^+0-9]/g, '')
}

function icsDate(value) {
  if (!value) return ''
  return String(value).replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function line(label, value) {
  return value ? label + ':' + value : ''
}

export function defaultQrForm() {
  return {
    websiteUrl: 'https://mailrandom.com',
    plainText: 'MailRandom - Free Email & Web Tools for Everyone',
    wifiSsid: 'MailRandom WiFi',
    wifiPassword: 'strong-password',
    wifiSecurity: 'WPA',
    wifiHidden: false,
    whatsappPhone: '+15551234567',
    whatsappMessage: 'Hello from MailRandom',
    vcardFirstName: 'Alex',
    vcardLastName: 'Morgan',
    vcardPhone: '+15551234567',
    vcardEmail: 'alex@company.com',
    vcardCompany: 'MailRandom',
    vcardTitle: 'Product Lead',
    vcardWebsite: 'https://mailrandom.com',
    vcardAddress: 'New York, USA',
    emailTo: 'hello@example.com',
    emailSubject: 'Hello from MailRandom',
    emailBody: 'I generated this QR code with MailRandom.',
    smsPhone: '+15551234567',
    smsMessage: 'Hello from MailRandom',
    phoneNumber: '+15551234567',
    eventTitle: 'MailRandom Demo',
    eventStart: '2026-06-07T09:00',
    eventEnd: '2026-06-07T10:00',
    eventLocation: 'Online',
    eventDescription: 'QR Code Generator demo.',
    latitude: '40.7128',
    longitude: '-74.0060',
    geoLabel: 'New York',
    twitterHandle: 'mailrandom',
    instagramHandle: 'mailrandom',
    youtubeVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    facebookPage: 'https://www.facebook.com/mailrandom',
    skypeId: 'live:mailrandom',
    zoomLink: 'https://zoom.us/j/1234567890',
  }
}

export function buildQrPayload(type, form) {
  if (type === 'website') return normalizeQrUrl(form.websiteUrl)
  if (type === 'text') return String(form.plainText || '')
  if (type === 'wifi') return 'WIFI:T:' + form.wifiSecurity + ';S:' + escapeWifiValue(form.wifiSsid) + ';P:' + escapeWifiValue(form.wifiPassword) + ';H:' + (form.wifiHidden ? 'true' : 'false') + ';;'
  if (type === 'whatsapp') return 'https://wa.me/' + compactPhone(form.whatsappPhone).replace(/^\+/, '') + '?text=' + encodeURIComponent(form.whatsappMessage || '')
  if (type === 'email') return 'mailto:' + String(form.emailTo || '').trim() + '?subject=' + encodeURIComponent(form.emailSubject || '') + '&body=' + encodeURIComponent(form.emailBody || '')
  if (type === 'sms') return 'SMSTO:' + compactPhone(form.smsPhone) + ':' + String(form.smsMessage || '')
  if (type === 'phone') return 'tel:' + compactPhone(form.phoneNumber)
  if (type === 'geo') return 'geo:' + form.latitude + ',' + form.longitude + '?q=' + form.latitude + ',' + form.longitude + '(' + encodeURIComponent(form.geoLabel || 'Location') + ')'
  if (type === 'twitter') return 'https://x.com/' + cleanHandle(form.twitterHandle)
  if (type === 'instagram') return 'https://www.instagram.com/' + cleanHandle(form.instagramHandle)
  if (type === 'youtube') return normalizeQrUrl(form.youtubeVideo)
  if (type === 'facebook') return normalizeQrUrl(form.facebookPage)
  if (type === 'skype') return 'skype:' + String(form.skypeId || '').trim() + '?chat'
  if (type === 'zoom') return normalizeQrUrl(form.zoomLink)
  if (type === 'vcard') {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + (form.vcardLastName || '') + ';' + (form.vcardFirstName || '') + ';;;',
      'FN:' + [form.vcardFirstName, form.vcardLastName].filter(Boolean).join(' '),
      line('ORG', form.vcardCompany),
      line('TITLE', form.vcardTitle),
      line('TEL;TYPE=CELL', form.vcardPhone),
      line('EMAIL', form.vcardEmail),
      line('URL', normalizeQrUrl(form.vcardWebsite)),
      line('ADR', form.vcardAddress),
      'END:VCARD',
    ].filter(Boolean).join('\n')
  }
  if (type === 'calendar') {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      line('SUMMARY', form.eventTitle),
      line('DTSTART', icsDate(form.eventStart)),
      line('DTEND', icsDate(form.eventEnd)),
      line('LOCATION', form.eventLocation),
      line('DESCRIPTION', form.eventDescription),
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\n')
  }
  return ''
}

export function createStyledQrOptions({ payload, design, logo }) {
  const gradient = design.gradientEnabled
    ? { type: design.gradientType, rotation: Number(design.gradientRotation), colorStops: [{ offset: 0, color: design.foregroundColor }, { offset: 1, color: design.gradientColor }] }
    : undefined

  return {
    width: 320,
    height: 320,
    type: 'canvas',
    data: payload || ' ',
    margin: Number(design.margin),
    image: logo || undefined,
    qrOptions: { errorCorrectionLevel: design.errorCorrectionLevel },
    dotsOptions: { type: design.dotStyle, color: design.foregroundColor, gradient },
    cornersSquareOptions: { type: design.cornerSquareStyle, color: design.cornerColor },
    cornersDotOptions: { type: design.cornerDotStyle, color: design.cornerDotColor },
    backgroundOptions: { color: design.backgroundColor },
    imageOptions: { hideBackgroundDots: true, imageSize: Number(design.logoSize), margin: 4, crossOrigin: 'anonymous' },
  }
}
