import { useMemo, useRef, useState } from 'react'
import { Seo } from '../components/Seo'
import { ActionButton, EmptyState, FieldLabel, ResultBox, ToolShell } from '../components/ToolCard'
import { copyText, downloadText } from '../utils/exportUtils'
import {
  BULK_URL_EXAMPLE,
  applyUrlAffixes,
  buildOpenSchedule,
  filterUrlsByDomain,
  getBulkOpenSafetyWarning,
  parseUrls,
  urlsToText,
} from '../utils/urlUtils'

const inputClass = 'w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-green focus:ring-4 focus:ring-green/15'
const textAreaClass = 'min-h-[24rem] w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-sm leading-6 text-ink outline-none transition focus:border-green focus:ring-4 focus:ring-green/15'

function StatCard({ label, value, tone = 'ink' }) {
  const color = tone === 'warning' ? 'text-coral-dark' : tone === 'green' ? 'text-green-dark' : 'text-ink'

  return (
    <div className='rounded-md border border-ink/10 bg-paper p-3'>
      <p className='text-xs font-black uppercase tracking-wide text-ink/45'>{label}</p>
      <p className={'mt-1 font-display text-2xl font-black ' + color}>{value}</p>
    </div>
  )
}

function PopupGuide() {
  return (
    <div className='rounded-md border border-coral/25 bg-coral/10 p-4 text-sm leading-6 text-ink'>
      <p className='font-black text-coral-dark'>Popup blocker detected.</p>
      <p className='mt-2'>Allow pop-ups and redirects for this site, then try again with fewer URLs or a longer delay. On mobile browsers, bulk opening may be limited by the browser even when pop-ups are allowed.</p>
    </div>
  )
}

export function BulkUrlOpener() {
  const [text, setText] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [openMode, setOpenMode] = useState('tab')
  const [delaySeconds, setDelaySeconds] = useState('1')
  const [randomDelay, setRandomDelay] = useState(false)
  const [status, setStatus] = useState('')
  const [blockedPopups, setBlockedPopups] = useState(0)
  const [openProgress, setOpenProgress] = useState({ attempted: 0, opened: 0, total: 0 })
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const parsed = useMemo(() => parseUrls(text), [text])
  const filteredUrls = useMemo(() => filterUrlsByDomain(parsed.valid, domainFilter), [parsed.valid, domainFilter])
  const output = useMemo(() => urlsToText(filteredUrls), [filteredUrls])
  const safetyWarning = getBulkOpenSafetyWarning(filteredUrls.length, delaySeconds)
  const estimatedSchedule = useMemo(() => buildOpenSchedule(filteredUrls.length, delaySeconds, false), [filteredUrls.length, delaySeconds])
  const estimatedDuration = estimatedSchedule.length ? Math.round(estimatedSchedule[estimatedSchedule.length - 1] / 1000) : 0

  function setUrlList(urls, nextStatus) {
    setText(urlsToText(urls))
    setStatus(nextStatus)
    setBlockedPopups(0)
  }

  function handleLoadExample() {
    setText(BULK_URL_EXAMPLE)
    setDomainFilter('')
    setStatus('Example URLs loaded. Missing protocols will be normalized automatically.')
    setBlockedPopups(0)
  }

  async function handleFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!['txt', 'csv'].includes(extension || '')) {
      setStatus('Please upload a TXT or CSV file.')
      event.target.value = ''
      return
    }

    const contents = await file.text()
    setText((current) => (current.trim() ? current.trim() + '\n' + contents.trim() : contents.trim()))
    setStatus('Loaded URLs from ' + file.name + '.')
    setBlockedPopups(0)
    event.target.value = ''
  }

  function handleSelectAll() {
    textareaRef.current?.focus()
    textareaRef.current?.select()
    setStatus('Input selected. Use copy if you want to place it on the clipboard.')
  }

  function handleRemoveDuplicates() {
    setUrlList(parsed.valid, 'Removed duplicate URLs and kept the first occurrence.')
  }

  function handleReverseList() {
    setUrlList([...filteredUrls].reverse(), 'Reversed the current URL list.')
  }

  function handleClearAll() {
    setText('')
    setDomainFilter('')
    setPrefix('')
    setSuffix('')
    setStatus('Cleared all URLs and filters.')
    setBlockedPopups(0)
    setOpenProgress({ attempted: 0, opened: 0, total: 0 })
  }

  function handleApplyAffixes() {
    if (!filteredUrls.length) return
    const transformed = applyUrlAffixes(filteredUrls, prefix, suffix)
    setUrlList(transformed, 'Applied prefix and suffix to the current normalized URLs.')
  }

  async function handleCopy() {
    const ok = await copyText(output)
    setStatus(ok ? 'Copied normalized URLs.' : 'Clipboard access was blocked by the browser.')
  }

  function handleDownload() {
    downloadText('mailrandom-normalized-urls.txt', output)
    setStatus('Downloaded normalized URLs as TXT.')
  }

  function openUrl(url) {
    if (openMode === 'window') {
      return window.open(url, '_blank', 'popup=yes,width=1100,height=800,left=80,top=80,noopener,noreferrer')
    }

    const opened = window.open(url, '_blank')
    if (opened) opened.opener = null
    return opened
  }

  function handleOpenAll() {
    if (!filteredUrls.length) {
      setStatus('Add at least one valid URL before opening.')
      return
    }

    if (safetyWarning) {
      const confirmed = window.confirm(safetyWarning + '\n\nContinue opening these URLs?')
      if (!confirmed) {
        setStatus('Open request cancelled.')
        return
      }
    }

    const schedule = buildOpenSchedule(filteredUrls.length, delaySeconds, randomDelay)
    let openedCount = 0
    let blockedCount = 0
    let attemptedCount = 0

    setBlockedPopups(0)
    setOpenProgress({ attempted: 0, opened: 0, total: filteredUrls.length })
    setStatus('Opening ' + filteredUrls.length + ' URLs. Keep this tab active until the queue finishes.')

    filteredUrls.forEach((url, index) => {
      window.setTimeout(() => {
        const handle = openUrl(url)
        attemptedCount += 1

        if (handle) openedCount += 1
        else blockedCount += 1

        setOpenProgress({ attempted: attemptedCount, opened: openedCount, total: filteredUrls.length })
        setBlockedPopups(blockedCount)

        if (attemptedCount === filteredUrls.length) {
          setStatus('Open request finished: ' + openedCount + ' opened, ' + blockedCount + ' blocked.')
        }
      }, schedule[index])
    })
  }

  return (
    <>
      <Seo title='Bulk URL Opener' description='Normalize, deduplicate, filter, and open multiple URLs with safe tab or window controls and configurable delays.' />
      <ToolShell title='Bulk URL Opener' description='Normalize, clean, filter, and open multiple URLs locally from your browser with controlled delays.' icon='ExternalLink' accent='green'>
        <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='grid gap-6'>
            <ResultBox>
              <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-xs font-black uppercase text-ink/45'>Input URLs</p>
                  <h2 className='font-display text-2xl font-black text-ink'>Paste one URL per line</h2>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <ActionButton icon='FileText' variant='secondary' onClick={handleLoadExample}>Load Example</ActionButton>
                  <ActionButton icon='FileText' variant='secondary' onClick={() => fileInputRef.current?.click()}>Upload TXT/CSV</ActionButton>
                  <input ref={fileInputRef} type='file' accept='.txt,.csv,text/plain,text/csv' className='hidden' onChange={handleFileUpload} />
                </div>
              </div>

              <textarea ref={textareaRef} className={textAreaClass} value={text} onChange={(event) => setText(event.target.value)} placeholder={'example.com\nhttps://mailrandom.com\nopenai.com'} />

              <div className='mt-4 flex flex-wrap gap-2'>
                <ActionButton icon='Check' variant='secondary' disabled={!text} onClick={handleSelectAll}>Select all</ActionButton>
                <ActionButton icon='Check' variant='secondary' disabled={!parsed.valid.length} onClick={handleRemoveDuplicates}>Remove duplicates</ActionButton>
                <ActionButton icon='Check' variant='secondary' disabled={!filteredUrls.length} onClick={handleReverseList}>Reverse list</ActionButton>
                <ActionButton icon='X' variant='secondary' disabled={!text && !domainFilter && !prefix && !suffix} onClick={handleClearAll}>Clear all</ActionButton>
              </div>
            </ResultBox>

            <ResultBox>
              <div className='mb-4'>
                <p className='text-xs font-black uppercase text-ink/45'>Transform</p>
                <h2 className='font-display text-2xl font-black text-ink'>Prefix, suffix, and filter</h2>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <FieldLabel htmlFor='url-prefix'>Add prefix</FieldLabel>
                  <input id='url-prefix' className={inputClass} value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder='https://redirect.example/?url=' />
                </div>
                <div>
                  <FieldLabel htmlFor='url-suffix'>Add suffix</FieldLabel>
                  <input id='url-suffix' className={inputClass} value={suffix} onChange={(event) => setSuffix(event.target.value)} placeholder='?ref=mailrandom' />
                </div>
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                <ActionButton icon='Check' disabled={!filteredUrls.length || (!prefix && !suffix)} onClick={handleApplyAffixes}>Apply prefix/suffix</ActionButton>
              </div>
              <div className='mt-4'>
                <FieldLabel htmlFor='domain-filter'>Filter by domain</FieldLabel>
                <input id='domain-filter' className={inputClass} value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)} placeholder='gmail.com, company.com, example.org' />
                <p className='mt-2 text-xs font-bold leading-5 text-ink/55'>Matches exact domains and subdomains. Leave empty to open all normalized URLs.</p>
              </div>
            </ResultBox>
          </div>

          <div className='grid gap-6'>
            <ResultBox>
              <div className='mb-4'>
                <p className='text-xs font-black uppercase text-ink/45'>Opening Controls</p>
                <h2 className='font-display text-2xl font-black text-ink'>Safe browser opening</h2>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <FieldLabel htmlFor='open-mode'>Open using</FieldLabel>
                  <select id='open-mode' className={inputClass} value={openMode} onChange={(event) => setOpenMode(event.target.value)}>
                    <option value='tab'>New Tab</option>
                    <option value='window'>New Window</option>
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor='delay-seconds'>Delay between opens (seconds)</FieldLabel>
                  <input id='delay-seconds' type='number' min='0' step='0.25' className={inputClass} value={delaySeconds} onChange={(event) => setDelaySeconds(event.target.value)} />
                </div>
              </div>
              <label className='mt-4 flex items-center gap-3 rounded-md bg-paper px-3 py-3 text-sm font-bold text-ink'>
                <input type='checkbox' className='h-4 w-4 accent-green' checked={randomDelay} onChange={(event) => setRandomDelay(event.target.checked)} />
                Randomize delay to reduce burst opening
              </label>

              <div className='mt-4 grid gap-3 rounded-md border border-amber/40 bg-amber/20 p-4 text-sm leading-6 text-ink'>
                <p className='font-black'>Safety warning</p>
                <p>Opening too many URLs too quickly can trigger browser protection or look like spam. Use a delay, verify the list, and avoid opening unknown links.</p>
                {safetyWarning && <p className='font-black text-coral-dark'>{safetyWarning}</p>}
              </div>

              <div className='mt-4 flex flex-wrap gap-2'>
                <ActionButton icon='ExternalLink' disabled={!filteredUrls.length} onClick={handleOpenAll}>Open All URLs</ActionButton>
                <ActionButton icon='Copy' variant='secondary' disabled={!output} onClick={handleCopy}>Copy</ActionButton>
                <ActionButton icon='Download' variant='secondary' disabled={!output} onClick={handleDownload}>Download TXT</ActionButton>
              </div>
            </ResultBox>

            <ResultBox>
              <div className='mb-4 grid gap-3 sm:grid-cols-4'>
                <StatCard label='Input items' value={parsed.totalCandidates} />
                <StatCard label='Ready URLs' value={filteredUrls.length} tone='green' />
                <StatCard label='Duplicates' value={parsed.duplicateCount} />
                <StatCard label='Invalid' value={parsed.invalid.length} tone='warning' />
              </div>

              <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-xs font-black uppercase text-ink/45'>Normalized Output</p>
                  <h2 className='font-display text-2xl font-black text-ink'>{filteredUrls.length} URLs ready</h2>
                  <p className='mt-1 text-sm font-bold text-ink/55'>Estimated queue duration: {estimatedDuration}s{randomDelay ? ' plus random variation' : ''}</p>
                </div>
              </div>

              {status && <p className='mb-3 rounded-md bg-green/10 px-3 py-2 text-sm font-bold text-green-dark'>{status}</p>}
              {openProgress.total > 0 && <p className='mb-3 rounded-md bg-paper px-3 py-2 text-sm font-bold text-ink'>Progress: {openProgress.attempted}/{openProgress.total} attempted, {openProgress.opened} opened.</p>}
              {blockedPopups > 0 && <div className='mb-3'><PopupGuide /></div>}

              {output ? (
                <textarea className='min-h-80 w-full resize-y rounded-md border border-ink/10 bg-paper px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-green focus:ring-4 focus:ring-green/15' value={output} readOnly={true} />
              ) : (
                <EmptyState icon='ExternalLink' title='No valid URLs yet' text='Valid HTTP and HTTPS links appear here after normalization, dedupe, and filtering.' />
              )}

              {parsed.invalid.length > 0 && (
                <details className='mt-4 rounded-md border border-ink/10 bg-paper p-3 text-sm text-ink/70'>
                  <summary className='cursor-pointer font-black text-ink'>View ignored invalid entries</summary>
                  <div className='mt-3 grid gap-2'>
                    {parsed.invalid.slice(0, 20).map((item, index) => <p key={item.original + index} className='font-mono text-xs'>{item.original || '(empty)'} - {item.reason}</p>)}
                    {parsed.invalid.length > 20 && <p className='text-xs font-bold'>Only the first 20 invalid entries are shown.</p>}
                  </div>
                </details>
              )}
            </ResultBox>
          </div>
        </div>
      </ToolShell>
    </>
  )
}

