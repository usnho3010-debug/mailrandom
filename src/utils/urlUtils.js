export const BULK_URL_EXAMPLE = [
  'mailrandom.com',
  'https://example.com/products',
  'openai.com',
  'https://developer.mozilla.org/en-US/',
  'example.com/products',
  'https://github.com/',
].join('\n')

function isLikelyWebHost(hostname) {
  const host = String(hostname || '').toLowerCase()
  const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) && host.split('.').every((part) => Number(part) <= 255)
  const ipv6 = host.includes(':')
  return host === 'localhost' || host.includes('.') || ipv4 || ipv6
}

function cleanCell(value) {
  return String(value || '')
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/^[<({["']+/, '')
    .replace(/[>)}\]"']+$/, '')
    .replace(/[.,;]+$/g, '')
    .trim()
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"' && inQuotes && next === '"') {
      current += '"'
      index += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if ((char === ',' || char === '\t') && !inQuotes) {
      cells.push(current)
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current)
  return cells
}

export function extractUrlCandidates(value) {
  return String(value || '')
    .split(/\r?\n/)
    .flatMap((line) => {
      const trimmed = line.trim()
      if (!trimmed) return []

      const cells = /[,\t]/.test(trimmed) ? parseCsvLine(trimmed) : trimmed.split(/\s+/)
      return cells.map(cleanCell).filter(Boolean)
    })
}

export function normalizeUrlCandidate(rawValue) {
  const original = String(rawValue || '').trim()
  const cleaned = cleanCell(original)

  if (!cleaned) return { original, normalized: '', valid: false, reason: 'Empty value' }
  if (/^(mailto|tel|javascript|data|ftp):/i.test(cleaned)) return { original, normalized: '', valid: false, reason: 'Only HTTP and HTTPS URLs are supported' }

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(cleaned) ? cleaned : 'https://' + cleaned

  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { original, normalized: '', valid: false, reason: 'Only HTTP and HTTPS URLs are supported' }
    }
    if (!url.hostname) return { original, normalized: '', valid: false, reason: 'Missing hostname' }
    if (!isLikelyWebHost(url.hostname)) return { original, normalized: '', valid: false, reason: 'Hostname must include a domain, localhost, or IP address' }

    return { original, normalized: url.href, valid: true, reason: '' }
  } catch {
    return { original, normalized: '', valid: false, reason: 'Invalid URL syntax' }
  }
}

export function parseUrls(value) {
  const candidates = extractUrlCandidates(value)
  const valid = []
  const invalid = []
  const duplicates = []
  const seen = new Set()

  for (const candidate of candidates) {
    const result = normalizeUrlCandidate(candidate)

    if (!result.valid) {
      invalid.push(result)
      continue
    }

    const key = result.normalized.toLowerCase()
    if (seen.has(key)) {
      duplicates.push(result)
      continue
    }

    seen.add(key)
    valid.push(result.normalized)
  }

  return {
    totalCandidates: candidates.length,
    valid,
    invalid,
    duplicates,
    duplicateCount: duplicates.length,
  }
}

export function urlsToText(urls) {
  return urls.join('\n')
}

function normalizeDomainFilter(value) {
  const cleaned = String(value || '').trim().toLowerCase()
  if (!cleaned) return ''

  try {
    const asUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(cleaned) ? cleaned : 'https://' + cleaned
    return new URL(asUrl).hostname.replace(/^www\./, '')
  } catch {
    return cleaned.replace(/^www\./, '').replace(/^\.+|\.+$/g, '')
  }
}

export function filterUrlsByDomain(urls, domainFilter) {
  const domains = String(domainFilter || '')
    .split(/[\s,]+/)
    .map(normalizeDomainFilter)
    .filter(Boolean)

  if (!domains.length) return urls

  return urls.filter((urlValue) => {
    try {
      const hostname = new URL(urlValue).hostname.toLowerCase().replace(/^www\./, '')
      return domains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))
    } catch {
      return false
    }
  })
}

export function applyUrlAffixes(urls, prefix, suffix) {
  return urls.map((url) => String(prefix || '') + url + String(suffix || ''))
}

export function buildOpenSchedule(count, delaySeconds, randomDelay) {
  const baseDelay = Math.max(0, Number(delaySeconds) || 0) * 1000
  const schedule = []
  let elapsed = 0

  for (let index = 0; index < count; index += 1) {
    if (index === 0) {
      schedule.push(0)
      continue
    }

    if (randomDelay) {
      const minimum = baseDelay > 0 ? Math.max(250, baseDelay * 0.5) : 500
      const maximum = baseDelay > 0 ? Math.max(minimum, baseDelay * 1.5) : 2000
      elapsed += Math.round(minimum + Math.random() * (maximum - minimum))
    } else {
      elapsed += baseDelay
    }

    schedule.push(elapsed)
  }

  return schedule
}

export function getBulkOpenSafetyWarning(count, delaySeconds) {
  const delay = Number(delaySeconds) || 0
  if (count > 100) return 'You are about to open more than 100 URLs. Use a long delay and make sure you trust every link.'
  if (count > 25 && delay < 1) return 'Opening many URLs with less than 1 second delay can trigger popup blockers or look like spam.'
  if (count > 10 && delay === 0) return 'Zero delay can open tabs too fast. Add a delay to reduce browser blocking.'
  return ''
}

