import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { ActionButton, EmptyState, FieldLabel, ResultBox, ToolShell } from '../components/ToolCard'
import { copyText, csvEscape, downloadJson, downloadText } from '../utils/exportUtils'
import { extractEmails } from '../utils/emailExtractorUtils'

const emptyStats = {
  totalEmailsFound: 0,
  uniqueEmails: 0,
  businessEmails: 0,
  personalEmails: 0,
  junkEmailsRemoved: 0,
}

export function EmailExtractor() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [sortAZ, setSortAZ] = useState(true)
  const [deepJunkClean, setDeepJunkClean] = useState(true)
  const [businessOnly, setBusinessOnly] = useState(false)
  const [autoFixSyntax, setAutoFixSyntax] = useState(true)
  const [domainFilter, setDomainFilter] = useState('')
  const [keywordFilter, setKeywordFilter] = useState('')
  const [result, setResult] = useState({ emails: [], stats: emptyStats })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const output = useMemo(() => result.emails.join('\n'), [result.emails])

  function runExtraction() {
    const nextResult = extractEmails(text, {
      removeDuplicates,
      sortAZ,
      deepJunkClean,
      businessOnly,
      autoFixSyntax,
      domainFilter,
      keywordFilter,
    })
    setResult(nextResult)
    setError('')
    setNotice('Extracted ' + nextResult.emails.length + ' emails locally in your browser.')
  }

  async function handleFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setNotice('')
    setFileName(file.name)

    try {
      const lowerName = file.name.toLowerCase()
      if (lowerName.endsWith('.docx')) {
        const mammothModule = await import('mammoth/mammoth.browser')
        const mammoth = mammothModule.default || mammothModule
        const arrayBuffer = await file.arrayBuffer()
        const extracted = await mammoth.extractRawText({ arrayBuffer })
        setText(extracted.value || '')
        setNotice('Loaded DOCX file with mammoth.js. Click Extract Emails to process it.')
        return
      }

      const raw = await file.text()
      if (lowerName.endsWith('.json')) {
        try {
          setText(JSON.stringify(JSON.parse(raw), null, 2))
        } catch {
          setText(raw)
        }
      } else {
        setText(raw)
      }
      setNotice('Loaded ' + file.name + '. Click Extract Emails to process it.')
    } catch {
      setError('Could not read this file in the browser.')
    } finally {
      event.target.value = ''
    }
  }

  async function handleCopy() {
    const ok = await copyText(output)
    setNotice(ok ? 'Copied extracted emails.' : 'Clipboard access was blocked by the browser.')
  }

  function handleClearAll() {
    setText('')
    setFileName('')
    setDomainFilter('')
    setKeywordFilter('')
    setResult({ emails: [], stats: emptyStats })
    setNotice('Cleared input, filters, and results.')
    setError('')
  }

  function handleDownloadCsv() {
    const csv = 'index,email\n' + result.emails.map((email, index) => String(index + 1) + ',' + csvEscape(email)).join('\n')
    downloadText('mailrandom-extracted-emails.csv', csv, 'text/csv;charset=utf-8')
    setNotice('Downloaded CSV file.')
  }

  function handleDownloadJson() {
    downloadJson('mailrandom-extracted-emails.json', {
      tool: 'Email Extractor Tool',
      sourceFile: fileName,
      filters: { domainFilter, keywordFilter, businessOnly },
      options: { removeDuplicates, sortAZ, deepJunkClean, autoFixSyntax },
      stats: result.stats,
      emails: result.emails,
      generatedAt: new Date().toISOString(),
      processing: 'local-browser-only',
    })
    setNotice('Downloaded JSON file.')
  }

  const statCards = [
    ['Total emails found', result.stats.totalEmailsFound],
    ['Unique emails', result.stats.uniqueEmails],
    ['Business emails', result.stats.businessEmails],
    ['Personal emails', result.stats.personalEmails],
    ['Junk emails removed', result.stats.junkEmailsRemoved],
  ]

  return (
    <>
      <Seo title='Email Extractor Tool' description='Extract, clean, deduplicate, sort, filter, copy, and export email addresses from pasted text or local files.' />
      <ToolShell title='Email Extractor Tool' description='Extract, clean, filter, copy, and export email addresses from pasted text or local files.' icon='ScanText' accent='amber'>
        <div className='grid gap-6 lg:grid-cols-[1fr_0.95fr]'>
          <ResultBox>
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-black uppercase text-ink/45'>Input source</p>
                <h2 className='font-display text-2xl font-black text-ink'>Paste text or upload file</h2>
              </div>
              <ActionButton icon='X' variant='secondary' disabled={!text && !output} onClick={handleClearAll}>Clear All</ActionButton>
            </div>

            <div className='mb-4 rounded-lg border border-dashed border-ink/20 bg-paper p-4'>
              <FieldLabel htmlFor='email-file'>Upload TXT, CSV, JSON, or DOCX</FieldLabel>
              <input id='email-file' type='file' accept='.txt,.csv,.json,.docx,text/plain,text/csv,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document' className='w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-sm font-bold text-ink file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-black file:text-paper' onChange={handleFileUpload} />
              <p className='mt-2 text-xs font-bold text-ink/50'>Files are read locally in your browser. DOCX is converted with mammoth.js.</p>
              {fileName && <p className='mt-2 text-xs font-black text-ink'>Loaded: {fileName}</p>}
            </div>

            <textarea className='min-h-[31rem] w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/20' value={text} onChange={(event) => setText(event.target.value)} placeholder='Paste emails, CRM exports, CSV rows, JSON content, page text, logs, or documents here.' />
          </ResultBox>

          <div className='grid gap-6'>
            <ResultBox>
              <div className='grid gap-4'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
                    <input type='checkbox' className='h-4 w-4 accent-amber' checked={removeDuplicates} onChange={(event) => setRemoveDuplicates(event.target.checked)} />
                    Remove duplicates
                  </label>
                  <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
                    <input type='checkbox' className='h-4 w-4 accent-amber' checked={sortAZ} onChange={(event) => setSortAZ(event.target.checked)} />
                    Sort A-Z
                  </label>
                  <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
                    <input type='checkbox' className='h-4 w-4 accent-amber' checked={deepJunkClean} onChange={(event) => setDeepJunkClean(event.target.checked)} />
                    Deep junk clean
                  </label>
                  <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
                    <input type='checkbox' className='h-4 w-4 accent-amber' checked={businessOnly} onChange={(event) => setBusinessOnly(event.target.checked)} />
                    Business emails only
                  </label>
                  <label className='flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink sm:col-span-2'>
                    <input type='checkbox' className='h-4 w-4 accent-amber' checked={autoFixSyntax} onChange={(event) => setAutoFixSyntax(event.target.checked)} />
                    Auto-fix basic syntax
                  </label>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <FieldLabel htmlFor='domain-filter'>Filter by domain</FieldLabel>
                    <input id='domain-filter' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/20' value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)} placeholder='gmail.com, company.com' />
                  </div>
                  <div>
                    <FieldLabel htmlFor='keyword-filter'>Filter by keyword</FieldLabel>
                    <input id='keyword-filter' className='w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/20' value={keywordFilter} onChange={(event) => setKeywordFilter(event.target.value)} placeholder='admin, hr, ceo, sales' />
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <ActionButton icon='ScanText' disabled={!text.trim()} onClick={runExtraction}>Extract Emails</ActionButton>
                  <ActionButton icon='X' variant='secondary' disabled={!text && !output} onClick={handleClearAll}>Clear All</ActionButton>
                </div>
              </div>
            </ResultBox>

            <ResultBox>
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
                {statCards.map(([label, value]) => (
                  <div key={label} className='rounded-md bg-paper p-3'>
                    <p className='text-xs font-black uppercase text-ink/45'>{label}</p>
                    <p className='mt-1 font-display text-2xl font-black text-ink'>{value}</p>
                  </div>
                ))}
              </div>
            </ResultBox>

            <ResultBox>
              <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-xs font-black uppercase text-ink/45'>Results</p>
                  <h2 className='font-display text-2xl font-black text-ink'>{result.emails.length} emails</h2>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <ActionButton icon='Copy' variant='secondary' disabled={!output} onClick={handleCopy}>Copy</ActionButton>
                  <ActionButton icon='Download' disabled={!output} onClick={() => { downloadText('mailrandom-extracted-emails.txt', output); setNotice('Downloaded TXT file.') }}>TXT</ActionButton>
                  <ActionButton icon='Download' disabled={!output} onClick={handleDownloadCsv}>CSV</ActionButton>
                  <ActionButton icon='Download' disabled={!output} onClick={handleDownloadJson}>JSON</ActionButton>
                </div>
              </div>

              {notice && <p className='mb-3 rounded-md bg-green/10 px-3 py-2 text-sm font-bold text-green-dark'>{notice}</p>}
              {error && <p className='mb-3 rounded-md bg-coral/10 px-3 py-2 text-sm font-bold text-coral-dark'>{error}</p>}

              {output ? (
                <textarea className='min-h-80 w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-amber focus:ring-4 focus:ring-amber/20' value={output} readOnly={true} />
              ) : (
                <EmptyState icon='ScanText' title='No emails extracted' text='Paste text or upload a file, then click Extract Emails.' />
              )}
            </ResultBox>
          </div>
        </div>
      </ToolShell>
    </>
  )
}

