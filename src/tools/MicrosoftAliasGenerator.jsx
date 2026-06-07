import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { ActionButton, EmptyState, FieldLabel, ResultBox, ToolShell } from '../components/ToolCard'
import {
  MICROSOFT_ALIAS_TYPES,
  MICROSOFT_QUANTITY_OPTIONS,
  generateAdvancedMicrosoftAliases,
  resolveMicrosoftQuantity,
} from '../utils/aliasUtils'
import {
  copyText,
  downloadAliasesDocx,
  downloadAliasesPdf,
  downloadJson,
  downloadText,
  toAliasCsv,
} from '../utils/exportUtils'

export function MicrosoftAliasGenerator() {
  const [email, setEmail] = useState('yourname@outlook.com')
  const [aliasType, setAliasType] = useState('Secure Random Number')
  const [keyword, setKeyword] = useState('secure')
  const [quantityChoice, setQuantityChoice] = useState(100)
  const [customQuantity, setCustomQuantity] = useState(1000)
  const [aliases, setAliases] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const quantity = resolveMicrosoftQuantity(quantityChoice, customQuantity)
  const output = useMemo(() => aliases.join('\n'), [aliases])

  function handleGenerate() {
    setNotice('')
    const result = generateAdvancedMicrosoftAliases({ email, aliasType, quantity, keyword })
    setAliases(result.aliases)
    setError(result.error)

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
    setNotice('Cleared generated aliases.')
  }

  function exportPayload() {
    return {
      tool: 'Microsoft / Outlook Alias Generator',
      email,
      aliasType,
      keyword,
      requestedQuantity: quantity,
      totalAliases: aliases.length,
      aliases,
      generatedAt: new Date().toISOString(),
      processing: 'local-browser-only',
      note: 'Microsoft email aliases use plus addressing only. Dot alias behavior is not supported like Gmail.',
    }
  }

  async function handleDownloadPdf() {
    await downloadAliasesPdf('mailrandom-microsoft-aliases.pdf', 'MailRandom Microsoft Aliases', aliases)
    setNotice('Downloaded PDF file.')
  }

  async function handleDownloadDocx() {
    await downloadAliasesDocx('mailrandom-microsoft-aliases.docx', 'MailRandom Microsoft Aliases', aliases)
    setNotice('Downloaded DOCX file.')
  }

  return (
    <>
      <Seo title='Microsoft / Outlook Alias Generator' description='Generate Outlook, Hotmail, and Live plus-address aliases locally with bulk copy and export options.' />
      <ToolShell title='Microsoft / Outlook Alias Generator' description='Generate plus-address aliases for Outlook, Hotmail, and Live mailboxes. No dot alias behavior is used.' icon='AtSign' accent='blue'>
        <div className='grid gap-6 lg:grid-cols-[0.85fr_1.15fr]'>
          <ResultBox className='h-fit'>
            <div className='grid gap-5'>
              <div>
                <FieldLabel htmlFor='outlook-address'>Outlook, Hotmail, or Live email</FieldLabel>
                <input id='outlook-address' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='name@outlook.com' />
                <p className='mt-2 text-xs font-bold text-ink/50'>Accepted domains: outlook.com, hotmail.com, live.com.</p>
              </div>

              <p className='rounded-md bg-amber/25 px-3 py-2 text-sm font-bold text-ink'>Microsoft email does not support the Gmail-style dot trick. This tool only creates aliases with the plus sign.</p>

              <div>
                <FieldLabel htmlFor='outlook-alias-type'>Alias type</FieldLabel>
                <select id='outlook-alias-type' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15' value={aliasType} onChange={(event) => setAliasType(event.target.value)}>
                  {MICROSOFT_ALIAS_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              {(aliasType === 'Keyword English Words' || aliasType === 'Smart Word + Number') && (
                <div>
                  <FieldLabel htmlFor='outlook-keyword'>Keyword</FieldLabel>
                  <input id='outlook-keyword' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15' value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder='secure' />
                </div>
              )}

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <FieldLabel htmlFor='outlook-quantity'>Quantity</FieldLabel>
                  <select id='outlook-quantity' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15' value={quantityChoice} onChange={(event) => setQuantityChoice(event.target.value === 'Custom' ? 'Custom' : Number(event.target.value))}>
                    {MICROSOFT_QUANTITY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                {quantityChoice === 'Custom' && (
                  <div>
                    <FieldLabel htmlFor='outlook-custom-quantity'>Custom quantity</FieldLabel>
                    <input id='outlook-custom-quantity' type='number' min='1' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15' value={customQuantity} onChange={(event) => setCustomQuantity(event.target.value)} />
                  </div>
                )}
              </div>

              <div className='flex flex-wrap gap-2'>
                <ActionButton icon='AtSign' onClick={handleGenerate}>Generate</ActionButton>
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
                <ActionButton icon='Copy' variant='secondary' disabled={!output} onClick={handleCopy}>Copy</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadText('mailrandom-microsoft-aliases.txt', output); setNotice('Downloaded TXT file.') }}>TXT</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadText('mailrandom-microsoft-aliases.csv', toAliasCsv(aliases), 'text/csv;charset=utf-8'); setNotice('Downloaded CSV file.') }}>CSV</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={() => { downloadJson('mailrandom-microsoft-aliases.json', exportPayload()); setNotice('Downloaded JSON file.') }}>JSON</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={handleDownloadPdf}>PDF</ActionButton>
                <ActionButton icon='Download' disabled={!output} onClick={handleDownloadDocx}>DOCX</ActionButton>
              </div>
            </div>

            {notice && <p className='mb-3 rounded-md bg-green/10 px-3 py-2 text-sm font-bold text-green-dark'>{notice}</p>}
            {error && <p className='mb-3 rounded-md bg-coral/10 px-3 py-2 text-sm font-bold text-coral-dark'>{error}</p>}

            {output ? (
              <textarea className='min-h-[32rem] w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-blue focus:ring-4 focus:ring-blue/15' value={output} readOnly={true} />
            ) : (
              <EmptyState icon='AtSign' title='No aliases generated' text='Enter a Microsoft email address, choose an alias type and quantity, then click Generate.' />
            )}
          </ResultBox>
        </div>
      </ToolShell>
    </>
  )
}

