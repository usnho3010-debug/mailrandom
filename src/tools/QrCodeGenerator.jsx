import { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Seo } from '../components/Seo'
import { ActionButton, EmptyState, FieldLabel, ResultBox, ToolShell } from '../components/ToolCard'
import { copyText } from '../utils/exportUtils'
import {
  QR_TYPES,
  buildQrPayload,
  cornerDotStyleOptions,
  cornerSquareStyleOptions,
  createStyledQrOptions,
  defaultQrForm,
  dotStyleOptions,
  errorCorrectionOptions,
} from '../utils/qrUtils'

const inputClass = 'w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15'
const textAreaClass = 'min-h-28 w-full resize-y rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15'

const defaultDesign = {
  foregroundColor: '#14213d',
  backgroundColor: '#fffdf7',
  cornerColor: '#14213d',
  cornerDotColor: '#e85d04',
  gradientEnabled: false,
  gradientType: 'linear',
  gradientColor: '#2a9d8f',
  gradientRotation: 0,
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  errorCorrectionLevel: 'H',
  logoSize: 0.18,
  margin: 8,
}

function FormInput({ id, label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input id={id} type={type} className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  )
}

function FormTextarea({ id, label, value, onChange, placeholder = '' }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea id={id} className={textAreaClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  )
}

export function QrCodeGenerator() {
  const [qrType, setQrType] = useState('website')
  const [form, setForm] = useState(defaultQrForm())
  const [design, setDesign] = useState(defaultDesign)
  const [logo, setLogo] = useState('')
  const [notice, setNotice] = useState('')
  const previewRef = useRef(null)
  const qrRef = useRef(null)

  const payload = useMemo(() => buildQrPayload(qrType, form), [qrType, form])
  const qrOptions = useMemo(() => createStyledQrOptions({ payload, design, logo }), [payload, design, logo])

  useEffect(() => {
    if (!previewRef.current) return
    if (!payload) {
      previewRef.current.innerHTML = ''
      return
    }

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(qrOptions)
      qrRef.current.append(previewRef.current)
      return
    }

    qrRef.current.update(qrOptions)
  }, [payload, qrOptions])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateDesign(field, value) {
    setDesign((current) => ({ ...current, [field]: value }))
  }

  async function handleLogoUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setLogo(String(reader.result || ''))
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  async function handleDownload(extension) {
    if (!qrRef.current || !payload) return
    await qrRef.current.download({ name: 'mailrandom-qr-code', extension })
    setNotice('Downloaded ' + extension.toUpperCase() + ' QR code.')
  }

  async function handleCopyPayload() {
    const ok = await copyText(payload)
    setNotice(ok ? 'Copied QR payload.' : 'Clipboard access was blocked by the browser.')
  }

  function resetDesign() {
    setDesign(defaultDesign)
    setLogo('')
    setNotice('Design reset.')
  }

  function renderTypeFields() {
    if (qrType === 'website') return <FormInput id='website-url' label='Website URL' value={form.websiteUrl} onChange={(value) => updateField('websiteUrl', value)} placeholder='https://example.com' />
    if (qrType === 'text') return <FormTextarea id='plain-text' label='Plain text' value={form.plainText} onChange={(value) => updateField('plainText', value)} />
    if (qrType === 'wifi') {
      return (
        <div className='grid gap-4'>
          <FormInput id='wifi-ssid' label='Network name' value={form.wifiSsid} onChange={(value) => updateField('wifiSsid', value)} />
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <FieldLabel htmlFor='wifi-security'>Security</FieldLabel>
              <select id='wifi-security' className={inputClass} value={form.wifiSecurity} onChange={(event) => updateField('wifiSecurity', event.target.value)}>
                <option value='WPA'>WPA/WPA2</option>
                <option value='WEP'>WEP</option>
                <option value='nopass'>No password</option>
              </select>
            </div>
            <FormInput id='wifi-password' label='Password' value={form.wifiPassword} onChange={(value) => updateField('wifiPassword', value)} />
          </div>
          <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
            <input type='checkbox' className='h-4 w-4 accent-coral' checked={form.wifiHidden} onChange={(event) => updateField('wifiHidden', event.target.checked)} />
            Hidden network
          </label>
        </div>
      )
    }
    if (qrType === 'whatsapp') return <div className='grid gap-4'><FormInput id='wa-phone' label='WhatsApp phone' value={form.whatsappPhone} onChange={(value) => updateField('whatsappPhone', value)} /><FormTextarea id='wa-message' label='Message' value={form.whatsappMessage} onChange={(value) => updateField('whatsappMessage', value)} /></div>
    if (qrType === 'vcard') {
      return (
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormInput id='vc-first' label='First name' value={form.vcardFirstName} onChange={(value) => updateField('vcardFirstName', value)} />
          <FormInput id='vc-last' label='Last name' value={form.vcardLastName} onChange={(value) => updateField('vcardLastName', value)} />
          <FormInput id='vc-phone' label='Phone' value={form.vcardPhone} onChange={(value) => updateField('vcardPhone', value)} />
          <FormInput id='vc-email' label='Email' value={form.vcardEmail} onChange={(value) => updateField('vcardEmail', value)} />
          <FormInput id='vc-company' label='Company' value={form.vcardCompany} onChange={(value) => updateField('vcardCompany', value)} />
          <FormInput id='vc-title' label='Title' value={form.vcardTitle} onChange={(value) => updateField('vcardTitle', value)} />
          <FormInput id='vc-website' label='Website' value={form.vcardWebsite} onChange={(value) => updateField('vcardWebsite', value)} />
          <FormInput id='vc-address' label='Address' value={form.vcardAddress} onChange={(value) => updateField('vcardAddress', value)} />
        </div>
      )
    }
    if (qrType === 'email') return <div className='grid gap-4'><FormInput id='email-to' label='To email' value={form.emailTo} onChange={(value) => updateField('emailTo', value)} /><FormInput id='email-subject' label='Subject' value={form.emailSubject} onChange={(value) => updateField('emailSubject', value)} /><FormTextarea id='email-body' label='Body' value={form.emailBody} onChange={(value) => updateField('emailBody', value)} /></div>
    if (qrType === 'sms') return <div className='grid gap-4'><FormInput id='sms-phone' label='Phone number' value={form.smsPhone} onChange={(value) => updateField('smsPhone', value)} /><FormTextarea id='sms-message' label='SMS message' value={form.smsMessage} onChange={(value) => updateField('smsMessage', value)} /></div>
    if (qrType === 'phone') return <FormInput id='phone-number' label='Phone number' value={form.phoneNumber} onChange={(value) => updateField('phoneNumber', value)} />
    if (qrType === 'calendar') return <div className='grid gap-4 sm:grid-cols-2'><FormInput id='event-title' label='Event title' value={form.eventTitle} onChange={(value) => updateField('eventTitle', value)} /><FormInput id='event-location' label='Location' value={form.eventLocation} onChange={(value) => updateField('eventLocation', value)} /><FormInput id='event-start' label='Start' type='datetime-local' value={form.eventStart} onChange={(value) => updateField('eventStart', value)} /><FormInput id='event-end' label='End' type='datetime-local' value={form.eventEnd} onChange={(value) => updateField('eventEnd', value)} /><div className='sm:col-span-2'><FormTextarea id='event-description' label='Description' value={form.eventDescription} onChange={(value) => updateField('eventDescription', value)} /></div></div>
    if (qrType === 'geo') return <div className='grid gap-4 sm:grid-cols-3'><FormInput id='geo-lat' label='Latitude' value={form.latitude} onChange={(value) => updateField('latitude', value)} /><FormInput id='geo-lng' label='Longitude' value={form.longitude} onChange={(value) => updateField('longitude', value)} /><FormInput id='geo-label' label='Label' value={form.geoLabel} onChange={(value) => updateField('geoLabel', value)} /></div>
    if (qrType === 'twitter') return <FormInput id='twitter-handle' label='Twitter/X handle' value={form.twitterHandle} onChange={(value) => updateField('twitterHandle', value)} placeholder='mailrandom' />
    if (qrType === 'instagram') return <FormInput id='instagram-handle' label='Instagram handle' value={form.instagramHandle} onChange={(value) => updateField('instagramHandle', value)} placeholder='mailrandom' />
    if (qrType === 'youtube') return <FormInput id='youtube-video' label='YouTube video URL' value={form.youtubeVideo} onChange={(value) => updateField('youtubeVideo', value)} />
    if (qrType === 'facebook') return <FormInput id='facebook-page' label='Facebook page URL' value={form.facebookPage} onChange={(value) => updateField('facebookPage', value)} />
    if (qrType === 'skype') return <FormInput id='skype-id' label='Skype ID' value={form.skypeId} onChange={(value) => updateField('skypeId', value)} />
    if (qrType === 'zoom') return <FormInput id='zoom-link' label='Zoom meeting link' value={form.zoomLink} onChange={(value) => updateField('zoomLink', value)} />
    return null
  }

  return (
    <>
      <Seo title='QR Code Generator' description='Create styled scannable QR codes for URLs, WiFi, contacts, email, SMS, events, geo locations, and social profiles.' />
      <ToolShell title='QR Code Generator' description='Create styled, scannable QR codes for links, WiFi, contacts, messages, events, locations, profiles, and meetings.' icon='QrCode' accent='coral'>
        <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='grid gap-6'>
            <ResultBox>
              <div className='grid gap-5'>
                <div>
                  <FieldLabel htmlFor='qr-kind'>QR type</FieldLabel>
                  <select id='qr-kind' className={inputClass} value={qrType} onChange={(event) => setQrType(event.target.value)}>
                    {QR_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                {renderTypeFields()}
              </div>
            </ResultBox>

            <ResultBox>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs font-black uppercase text-ink/45'>Design</p>
                  <h2 className='font-display text-2xl font-black text-ink'>QR styling</h2>
                </div>
                <ActionButton icon='X' variant='secondary' onClick={resetDesign}>Reset Design</ActionButton>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div><FieldLabel htmlFor='qr-fg'>QR color</FieldLabel><input id='qr-fg' type='color' className='h-12 w-full rounded-md border border-ink/15 bg-paper p-1' value={design.foregroundColor} onChange={(event) => updateDesign('foregroundColor', event.target.value)} /></div>
                <div><FieldLabel htmlFor='qr-bg'>Background color</FieldLabel><input id='qr-bg' type='color' className='h-12 w-full rounded-md border border-ink/15 bg-paper p-1' value={design.backgroundColor} onChange={(event) => updateDesign('backgroundColor', event.target.value)} /></div>
                <div><FieldLabel htmlFor='qr-corner'>Corner square color</FieldLabel><input id='qr-corner' type='color' className='h-12 w-full rounded-md border border-ink/15 bg-paper p-1' value={design.cornerColor} onChange={(event) => updateDesign('cornerColor', event.target.value)} /></div>
                <div><FieldLabel htmlFor='qr-corner-dot'>Corner dot color</FieldLabel><input id='qr-corner-dot' type='color' className='h-12 w-full rounded-md border border-ink/15 bg-paper p-1' value={design.cornerDotColor} onChange={(event) => updateDesign('cornerDotColor', event.target.value)} /></div>
              </div>

              <div className='mt-4 grid gap-3 rounded-md bg-paper p-3'>
                <label className='flex items-center gap-3 text-sm font-bold text-ink'><input type='checkbox' className='h-4 w-4 accent-coral' checked={design.gradientEnabled} onChange={(event) => updateDesign('gradientEnabled', event.target.checked)} />Gradient</label>
                {design.gradientEnabled && <div className='grid gap-4 sm:grid-cols-3'><div><FieldLabel htmlFor='gradient-type'>Gradient type</FieldLabel><select id='gradient-type' className={inputClass} value={design.gradientType} onChange={(event) => updateDesign('gradientType', event.target.value)}><option value='linear'>Linear</option><option value='radial'>Radial</option></select></div><div><FieldLabel htmlFor='gradient-color'>Gradient color</FieldLabel><input id='gradient-color' type='color' className='h-12 w-full rounded-md border border-ink/15 bg-white p-1' value={design.gradientColor} onChange={(event) => updateDesign('gradientColor', event.target.value)} /></div><div><FieldLabel htmlFor='gradient-rotation'>Rotation</FieldLabel><input id='gradient-rotation' type='number' className={inputClass} value={design.gradientRotation} onChange={(event) => updateDesign('gradientRotation', event.target.value)} /></div></div>}
              </div>

              <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                <div><FieldLabel htmlFor='dot-style'>Dot style</FieldLabel><select id='dot-style' className={inputClass} value={design.dotStyle} onChange={(event) => updateDesign('dotStyle', event.target.value)}>{dotStyleOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                <div><FieldLabel htmlFor='corner-square-style'>Corner square style</FieldLabel><select id='corner-square-style' className={inputClass} value={design.cornerSquareStyle} onChange={(event) => updateDesign('cornerSquareStyle', event.target.value)}>{cornerSquareStyleOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                <div><FieldLabel htmlFor='corner-dot-style'>Corner dot style</FieldLabel><select id='corner-dot-style' className={inputClass} value={design.cornerDotStyle} onChange={(event) => updateDesign('cornerDotStyle', event.target.value)}>{cornerDotStyleOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                <div><FieldLabel htmlFor='error-level'>Error correction</FieldLabel><select id='error-level' className={inputClass} value={design.errorCorrectionLevel} onChange={(event) => updateDesign('errorCorrectionLevel', event.target.value)}>{errorCorrectionOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              </div>

              <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                <div><FieldLabel htmlFor='logo-upload'>Upload logo</FieldLabel><input id='logo-upload' type='file' accept='image/png,image/jpeg,image/svg+xml,image/webp' className='w-full rounded-md border border-ink/15 bg-paper px-3 py-3 text-sm font-bold text-ink file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-black file:text-paper' onChange={handleLogoUpload} /></div>
                <div><FieldLabel htmlFor='logo-size'>Logo size: {Math.round(Number(design.logoSize) * 100)}%</FieldLabel><input id='logo-size' type='range' min='0.08' max='0.3' step='0.01' className='w-full accent-coral' value={design.logoSize} onChange={(event) => updateDesign('logoSize', event.target.value)} /></div>
              </div>
            </ResultBox>
          </div>

          <ResultBox>
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div><p className='text-xs font-black uppercase text-ink/45'>Preview</p><h2 className='font-display text-2xl font-black text-ink'>Styled QR code</h2></div>
              <div className='flex flex-wrap gap-2'><ActionButton icon='Copy' variant='secondary' disabled={!payload} onClick={handleCopyPayload}>Copy payload</ActionButton><ActionButton icon='Download' data-testid='download-png' disabled={!payload} onClick={() => handleDownload('png')}>PNG</ActionButton><ActionButton icon='Download' data-testid='download-svg' disabled={!payload} onClick={() => handleDownload('svg')}>SVG</ActionButton></div>
            </div>
            {notice && <p className='mb-3 rounded-md bg-green/10 px-3 py-2 text-sm font-bold text-green-dark'>{notice}</p>}
            {payload ? <div className='grid gap-5'><div className='grid min-h-[24rem] place-items-center overflow-auto rounded-lg bg-paper p-4'><div ref={previewRef} data-testid='qr-preview' className='rounded-md bg-white p-3 shadow-soft' /></div><textarea data-testid='qr-payload' className='min-h-32 w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-xs leading-5 text-ink outline-none focus:border-coral focus:ring-4 focus:ring-coral/15' value={payload} readOnly={true} /></div> : <EmptyState icon='QrCode' title='No QR code yet' text='Enter content to generate a scannable QR code locally in this browser tab.' />}
          </ResultBox>
        </div>
      </ToolShell>
    </>
  )
}

