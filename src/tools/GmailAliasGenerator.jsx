import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { ActionButton, EmptyState, FieldLabel, ResultBox, ToolShell } from '../components/ToolCard'
import {
  GMAIL_ALIAS_TYPES,
  GMAIL_PURPOSES,
  GMAIL_QUANTITY_OPTIONS,
  generateAdvancedGmailAliases,
  resolveGmailQuantity,
} from '../utils/aliasUtils'
import {
  copyText,
  downloadAliasesDocx,
  downloadAliasesPdf,
  downloadJson,
  downloadText,
  toAliasCsv,
} from '../utils/exportUtils'

export function GmailAliasGenerator() {
  const [email, setEmail] = useState('yourname@gmail.com')
  const [purpose, setPurpose] = useState('Shopping')
  const [customPurpose, setCustomPurpose] = useState('')
  const [aliasType, setAliasType] = useState('Plus Random Number')
  const [quantityChoice, setQuantityChoice] = useState(100)
  const [customQuantity, setCustomQuantity] = useState(1000)
  const [aliases, setAliases] = useState([])
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [notice, setNotice] = useState('')

  const quantity = resolveGmailQuantity(quantityChoice, customQuantity)
  const output = useMemo(() => aliases.join('\n'), [aliases])
  const performanceWarning = quantity > 30000 ? 'Performance warning: generating more than 30,000 aliases can slow down this browser tab.' : ''

  function handleGenerate() {
    setNotice('')
    const result = generateAdvancedGmailAliases({ email, purpose, customPurpose, aliasType, quantity })
    setAliases(result.aliases)
    setError(result.error)
    setWarning(result.warning || performanceWarning)

    if (!result.error) {
      setNotice('Generated ' + result.aliases.length + ' aliases locally in your browser.')
    }
  }

  async function handleCopy() {
    const ok = await copyText(output)
    setNotice(ok ? 'Copied aliases to clipboard.' : 'Clipboard access was blocked by the browser.')
  }

  function handleClear() {
    setAliases([])
    setError('')
    setWarning(performanceWarning)
    setNotice('Cleared generated aliases.')
  }

  function exportPayload() {
    return {
      tool: 'Gmail Alias Generator',
      email,
      purpose,
      customPurpose: purpose === 'Custom' ? customPurpose : '',
      aliasType,
      requestedQuantity: quantity,
      totalAliases: aliases.length,
      aliases,
      generatedAt: new Date().toISOString(),
      processing: 'local-browser-only',
    }
  }

  async function handleDownloadDocx() {
    await downloadAliasesDocx('mailrandom-gmail-aliases.docx', 'MailRandom Gmail Aliases', aliases)
    setNotice('Downloaded DOCX file.')
  }

  async function handleDownloadPdf() {
    await downloadAliasesPdf('mailrandom-gmail-aliases.pdf', 'MailRandom Gmail Aliases', aliases)
    setNotice('Downloaded PDF file.')
  }

  return (
    <>
      <Seo title='Gmail Alias Generator' description='Generate Gmail aliases locally with plus addressing, dot aliases, purpose presets, bulk output, and export formats.' />
      <ToolShell title='Gmail Alias Generator' description='Generate Gmail aliases locally with purpose presets, plus-address patterns, dot aliases, and export formats.' icon='MailPlus' accent='teal'>
        <div className='grid gap-6 lg:grid-cols-[0.85fr_1.15fr]'>
          <ResultBox className='h-fit'>
            <div className='grid gap-5'>
              <div>
                <FieldLabel htmlFor='gmail-address'>Gmail address</FieldLabel>
                <input id='gmail-address' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='name@gmail.com' />
                <p className='mt-2 text-xs font-bold text-ink/50'>Only gmail.com and googlemail.com are accepted.</p>
              </div>

              <div>
                <FieldLabel htmlFor='gmail-purpose'>Alias purpose</FieldLabel>
                <select id='gmail-purpose' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                  {GMAIL_PURPOSES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              {purpose === 'Custom' && (
                <div>
                  <FieldLabel htmlFor='gmail-custom-purpose'>Custom purpose word</FieldLabel>
                  <input id='gmail-custom-purpose' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={customPurpose} onChange={(event) => setCustomPurpose(event.target.value)} placeholder='myproject' />
                </div>
              )}

              <div>
                <FieldLabel htmlFor='gmail-alias-type'>Alias type</FieldLabel>
                <select id='gmail-alias-type' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={aliasType} onChange={(event) => setAliasType(event.target.value)}>
                  {GMAIL_ALIAS_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <FieldLabel htmlFor='gmail-quantity'>Quantity</FieldLabel>
                  <select id='gmail-quantity' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={quantityChoice} onChange={(event) => setQuantityChoice(event.target.value === 'Custom' ? 'Custom' : Number(event.target.value))}>
                    {GMAIL_QUANTITY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                {quantityChoice === 'Custom' && (
                  <div>
                    <FieldLabel htmlFor='gmail-custom-quantity'>Custom quantity</FieldLabel>
                    <input id='gmail-custom-quantity' type='number' min='1' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15' value={customQuantity} onChange={(event) => setCustomQuantity(event.target.value)} />
                  </div>
                )}
              </div>

              {performanceWarning && <p className='rounded-md bg-amber/25 px-3 py-2 text-sm font-bold text-ink'>{performanceWarning}</p>}

              <div className='flex flex-wrap gap-2'>
                <ActionButton icon='MailPlus' onClick={handleGenerate}>Generate</ActionButton>
                <ActionButton icon='X' variant='secondary' disabled={!aliases.length && !error && !notice} onClick={handleClear}>Clear</ActionButton>
              </div>
            </div>
          </ResultBox>

          <ResultBox>
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-black uppercase text-ink/45'>Generated aliases</p>
                <h2 className='font-display text-2xl font-black text-ink'>{aliases.length} aliases</h2>
              </div>
              <div className='flex flex-wrap gap-2'>
                <ActionButton icon='Copy' variant='secondary' disabled={!output} onClick={handleCopy}>Copy to clipboard</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadText('mailrandom-gmail-aliases.txt', output); setNotice('Downloaded TXT file.') }}>TXT</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadText('mailrandom-gmail-aliases.csv', toAliasCsv(aliases), 'text/csv;charset=utf-8'); setNotice('Downloaded CSV file.') }}>CSV</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadJson('mailrandom-gmail-aliases.json', exportPayload()); setNotice('Downloaded JSON file.') }}>JSON</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={handleDownloadPdf}>PDF</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={handleDownloadDocx}>DOCX</ActionButton>
              </div>
            </div>

            {notice && <p className='mb-3 rounded-md bg-green/10 px-3 py-2 text-sm font-bold text-green-dark'>{notice}</p>}
            {warning && <p className='mb-3 rounded-md bg-amber/25 px-3 py-2 text-sm font-bold text-ink'>{warning}</p>}
            {error && <p className='mb-3 rounded-md bg-coral/10 px-3 py-2 text-sm font-bold text-coral-dark'>{error}</p>}

            {output ? (
              <textarea className='min-h-[32rem] w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-teal focus:ring-4 focus:ring-teal/15' value={output} readOnly={true} />
            ) : (
              <EmptyState icon='MailPlus' title='No aliases generated' text='Choose an alias purpose, alias type, and quantity, then click Generate.' />
            )}
          </ResultBox>
        </div>
      </ToolShell>
    </>
  )
}

