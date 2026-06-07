const emailPattern = /[A-Z0-9._%+-]+\s*@\s*[A-Z0-9.-]+\s*\.\s*[A-Z]{2,24}/gi
const validEmailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/i

const personalDomains = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me', 'mail.com', 'gmx.com', 'gmx.net', 'yandex.com', 'yandex.ru', 'mail.ru'])
const junkDomains = new Set(['example.com', 'example.org', 'example.net', 'test.com', 'localhost', 'domain.com', 'email.com'])

function normalizeInput(text, autoFixSyntax) {
  let normalized = String(text || '').replace(/mailto:/gi, ' ').replace(/%40/g, '@').replace(/\\u0040/gi, '@')
  if (!autoFixSyntax) return normalized

  return normalized
    .replace(/\s+(?:at)\s+/gi, '@')
    .replace(/\s*\((?:at)\)\s*/gi, '@')
    .replace(/\s*\[(?:at)\]\s*/gi, '@')
    .replace(/\s*\{(?:at)\}\s*/gi, '@')
    .replace(/\s+(?:dot)\s+/gi, '.')
    .replace(/\s*\((?:dot)\)\s*/gi, '.')
    .replace(/\s*\[(?:dot)\]\s*/gi, '.')
    .replace(/\s*\{(?:dot)\}\s*/gi, '.')
}

function normalizeEmail(candidate, lowercase) {
  const cleaned = candidate
    .replace(/\s+/g, '')
    .replace(/^[<({]+/g, '')
    .replace(/[>)}\],;:!?]+$/g, '')
    .replace(/\.\.+/g, '.')

  return lowercase ? cleaned.toLowerCase() : cleaned
}

function isValidEmail(email) {
  if (!validEmailPattern.test(email)) return false
  const [local, domain] = email.toLowerCase().split('@')
  if (!local || !domain) return false
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false
  return !domain.split('.').some((label) => !label || label.startsWith('-') || label.endsWith('-'))
}

function getDomain(email) {
  return email.toLowerCase().split('@')[1] || ''
}

function isJunkEmail(email) {
  const domain = getDomain(email)
  if (junkDomains.has(domain)) return true
  const local = email.split('@')[0]
  return /^(noreply|no-reply|donotreply|do-not-reply|example|test)$/i.test(local)
}

export function isBusinessEmail(email) {
  return !personalDomains.has(getDomain(email))
}

function parseFilterList(value) {
  return String(value || '').split(/[\s,;]+/).map((item) => item.trim().toLowerCase()).filter(Boolean)
}

function matchesDomainFilter(email, filters) {
  if (!filters.length) return true
  const domain = getDomain(email)
  return filters.some((filter) => domain === filter.replace(/^@/, ''))
}

function matchesKeywordFilter(email, filters) {
  if (!filters.length) return true
  const lower = email.toLowerCase()
  const local = lower.split('@')[0] || ''
  return filters.some((filter) => local.includes(filter) || lower.includes(filter))
}

export function extractEmails(text, options = {}) {
  const { removeDuplicates = true, sortAZ = true, deepJunkClean = true, businessOnly = false, autoFixSyntax = true, domainFilter = '', keywordFilter = '', lowercase = true } = options
  const normalizedInput = normalizeInput(text, autoFixSyntax)
  const candidates = normalizedInput.match(emailPattern) || []
  const cleaned = []
  let junkRemoved = 0

  candidates.forEach((candidate) => {
    const email = normalizeEmail(candidate, lowercase)
    if (!isValidEmail(email)) {
      junkRemoved += 1
      return
    }
    if (deepJunkClean && isJunkEmail(email)) {
      junkRemoved += 1
      return
    }
    cleaned.push(email)
  })

  const unique = Array.from(new Set(cleaned))
  const uniqueEmails = removeDuplicates ? unique : cleaned
  const businessEmails = unique.filter((email) => isBusinessEmail(email)).length
  const personalEmails = unique.length - businessEmails
  const domainFilters = parseFilterList(domainFilter)
  const keywordFilters = parseFilterList(keywordFilter)

  let filtered = uniqueEmails
    .filter((email) => (businessOnly ? isBusinessEmail(email) : true))
    .filter((email) => matchesDomainFilter(email, domainFilters))
    .filter((email) => matchesKeywordFilter(email, keywordFilters))

  if (sortAZ) filtered = [...filtered].sort((a, b) => a.localeCompare(b))

  return { emails: filtered, stats: { totalEmailsFound: candidates.length, uniqueEmails: unique.length, businessEmails, personalEmails, junkEmailsRemoved: junkRemoved } }
}
