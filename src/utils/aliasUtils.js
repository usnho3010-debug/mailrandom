const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const gmailDomains = new Set(['gmail.com', 'googlemail.com'])
const microsoftDomains = new Set(['outlook.com', 'hotmail.com', 'live.com'])

export const GMAIL_PURPOSES = [
  'Shopping',
  'Job Hunting',
  'Subscriptions',
  'Freelancing',
  'Banking',
  'Education',
  'Healthcare',
  'Coupons',
  'Custom',
]

export const GMAIL_ALIAS_TYPES = [
  'Plus Random Number',
  'Plus Serial Number',
  'Plus English Words',
  'Plus Word + Number',
  'Dots Alias',
]

export const GMAIL_QUANTITY_OPTIONS = [10, 20, 50, 100, 200, 500, 1000, 5000, 10000, 'Custom']

export const MICROSOFT_ALIAS_TYPES = [
  'Secure Random Number',
  'Serial Number',
  'Keyword English Words',
  'Smart Word + Number',
]

export const MICROSOFT_QUANTITY_OPTIONS = [10, 20, 50, 100, 200, 500, 1000, 5000, 10000, 'Custom']

const purposeWords = {
  Shopping: ['shop', 'store', 'orders', 'cart', 'retail', 'market'],
  'Job Hunting': ['jobs', 'career', 'resume', 'hiring', 'interview', 'recruit'],
  Subscriptions: ['subscribe', 'newsletter', 'updates', 'member', 'digest', 'list'],
  Freelancing: ['freelance', 'client', 'project', 'invoice', 'contract', 'gig'],
  Banking: ['banking', 'finance', 'wallet', 'payment', 'money', 'account'],
  Education: ['education', 'course', 'school', 'study', 'class', 'learning'],
  Healthcare: ['health', 'medical', 'clinic', 'care', 'doctor', 'wellness'],
  Coupons: ['coupon', 'deal', 'promo', 'discount', 'saving', 'offer'],
}

const englishWords = [
  'alpha', 'anchor', 'apex', 'atlas', 'beam', 'bloom', 'brisk', 'cedar', 'clear', 'cloud',
  'coral', 'delta', 'ember', 'field', 'focus', 'forge', 'globe', 'green', 'harbor', 'honest',
  'ivory', 'jolly', 'keystone', 'lunar', 'maple', 'marble', 'meadow', 'north', 'nova', 'orbit',
  'pearl', 'pilot', 'pixel', 'quiet', 'rapid', 'river', 'silver', 'signal', 'solid', 'spark',
  'spring', 'steady', 'summit', 'swift', 'timber', 'ultra', 'urban', 'velvet', 'vivid', 'winter',
]

export function parseEmailAddress(value) {
  const email = value.trim().toLowerCase()
  if (!emailPattern.test(email)) return { error: 'Enter a valid email address.' }

  const atIndex = email.lastIndexOf('@')
  return {
    local: email.slice(0, atIndex),
    domain: email.slice(atIndex + 1),
    email,
  }
}

export function validateGmailAddress(value) {
  const parsed = parseEmailAddress(value)
  if (parsed.error) return parsed
  if (!gmailDomains.has(parsed.domain)) return { error: 'Only gmail.com or googlemail.com addresses are supported.' }
  return parsed
}

export function validateMicrosoftAddress(value) {
  const parsed = parseEmailAddress(value)
  if (parsed.error) return parsed
  if (!microsoftDomains.has(parsed.domain)) return { error: 'Only outlook.com, hotmail.com, or live.com addresses are supported.' }
  return parsed
}

export function sanitizeAliasToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function sanitizeTags(value) {
  return value
    .split(/\r?\n|,/)
    .map((tag) => sanitizeAliasToken(tag))
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index)
}

function cleanGmailLocal(local) {
  return local.replace(/\./g, '').split('+')[0]
}

function getPurposeTokens(purpose, customPurpose) {
  if (purpose === 'Custom') {
    const custom = sanitizeAliasToken(customPurpose)
    return custom ? [custom] : ['custom']
  }
  return purposeWords[purpose] || ['alias']
}

function randomNumber(min = 100000, max = 999999999) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function serialNumber(index, total) {
  const width = Math.max(2, String(total).length)
  return String(index + 1).padStart(width, '0')
}

function wordAt(index, purposeTokens) {
  const first = purposeTokens[index % purposeTokens.length]
  const second = englishWords[Math.floor(index / purposeTokens.length) % englishWords.length]
  const cycle = Math.floor(index / (purposeTokens.length * englishWords.length))
  return cycle ? first + '-' + second + '-' + cycle : first + '-' + second
}

function applyDotMask(local, mask) {
  if (local.length < 2) return local

  let output = ''
  for (let index = 0; index < local.length; index += 1) {
    output += local[index]
    if (index < local.length - 1) {
      const bit = (mask >> BigInt(index)) & 1n
      if (bit === 1n) output += '.'
    }
  }
  return output
}

export function generateDotVariants(local, limit = 80) {
  const cleanLocal = cleanGmailLocal(local)
  if (!cleanLocal) return []
  if (cleanLocal.length < 2) return [cleanLocal]

  const maxResults = Math.max(1, Number(limit) || 80)
  const totalMasks = 1n << BigInt(cleanLocal.length - 1)
  const count = totalMasks < BigInt(maxResults) ? Number(totalMasks) : maxResults
  const variants = []

  for (let index = 0; index < count; index += 1) {
    variants.push(applyDotMask(cleanLocal, BigInt(index)))
  }

  return variants
}

export function resolveGmailQuantity(quantityChoice, customQuantity) {
  const raw = quantityChoice === 'Custom' ? customQuantity : quantityChoice
  return Math.max(1, Math.floor(Number(raw) || 0))
}

export function resolveMicrosoftQuantity(quantityChoice, customQuantity) {
  const raw = quantityChoice === 'Custom' ? customQuantity : quantityChoice
  return Math.max(1, Math.floor(Number(raw) || 0))
}

export function generateAdvancedGmailAliases({
  email,
  purpose,
  customPurpose = '',
  aliasType,
  quantity,
}) {
  const parsed = validateGmailAddress(email)
  if (parsed.error) return { aliases: [], error: parsed.error, warning: '' }

  const count = Math.max(1, Math.floor(Number(quantity) || 0))
  const local = cleanGmailLocal(parsed.local)
  const purposeTokens = getPurposeTokens(purpose, customPurpose)
  const aliases = []
  const seen = new Set()
  const warning = count > 30000 ? 'Large quantities can slow down your browser. Generate in smaller batches if the tab becomes unresponsive.' : ''

  if (aliasType === 'Dots Alias') {
    const variants = generateDotVariants(local, count)
    return {
      aliases: variants.map((variant) => variant + '@' + parsed.domain),
      error: '',
      warning,
    }
  }

  let attempts = 0
  const maxAttempts = count * 4 + 100

  while (aliases.length < count && attempts < maxAttempts) {
    const index = aliases.length
    let tag = ''

    if (aliasType === 'Plus Random Number') tag = purposeTokens[index % purposeTokens.length] + randomNumber()
    if (aliasType === 'Plus Serial Number') tag = purposeTokens[index % purposeTokens.length] + serialNumber(index, count)
    if (aliasType === 'Plus English Words') tag = wordAt(index, purposeTokens)
    if (aliasType === 'Plus Word + Number') tag = wordAt(index, purposeTokens) + '-' + serialNumber(index, count)

    const alias = local + '+' + tag + '@' + parsed.domain
    if (!seen.has(alias)) {
      seen.add(alias)
      aliases.push(alias)
    }
    attempts += 1
  }

  return { aliases, error: '', warning }
}

export function generateGmailAliases({ email, tags, limit = 120, includeDots = true, includePlus = true }) {
  const parsed = validateGmailAddress(email)
  if (parsed.error) return { aliases: [], error: parsed.error }

  const maxResults = Math.max(1, Math.min(Number(limit) || 120, 500))
  const cleanLocal = cleanGmailLocal(parsed.local)
  const dotVariants = includeDots ? generateDotVariants(cleanLocal, maxResults) : [cleanLocal]
  const cleanTags = sanitizeTags(tags)
  const aliases = new Set()

  for (const variant of dotVariants) {
    aliases.add(variant + '@' + parsed.domain)
    if (aliases.size >= maxResults) break
  }

  if (includePlus && cleanTags.length) {
    for (const variant of dotVariants) {
      for (const tag of cleanTags) {
        aliases.add(variant + '+' + tag + '@' + parsed.domain)
        if (aliases.size >= maxResults) break
      }
      if (aliases.size >= maxResults) break
    }
  }

  return { aliases: Array.from(aliases).slice(0, maxResults), error: '' }
}

export function generateMicrosoftAliases({ email, tags, numberedCount = 3, includeDateTags = true, limit = 160 }) {
  const parsed = validateMicrosoftAddress(email)
  if (parsed.error) return { aliases: [], error: parsed.error }

  const cleanLocal = parsed.local.split('+')[0]
  const cleanTags = sanitizeTags(tags)
  const maxResults = Math.max(1, Math.min(Number(limit) || 160, 500))
  const count = Math.max(0, Math.min(Number(numberedCount) || 0, 25))
  const aliases = new Set()
  const year = new Date().getFullYear()

  for (const tag of cleanTags) {
    aliases.add(cleanLocal + '+' + tag + '@' + parsed.domain)
    if (includeDateTags) aliases.add(cleanLocal + '+' + tag + year + '@' + parsed.domain)
    for (let index = 1; index <= count; index += 1) {
      aliases.add(cleanLocal + '+' + tag + String(index).padStart(2, '0') + '@' + parsed.domain)
      if (aliases.size >= maxResults) break
    }
    if (aliases.size >= maxResults) break
  }

  return {
    aliases: Array.from(aliases).slice(0, maxResults),
    error: '',
    isMicrosoftDomain: microsoftDomains.has(parsed.domain),
  }
}

export function generateAdvancedMicrosoftAliases({ email, aliasType, quantity, keyword = 'mailrandom' }) {
  const parsed = validateMicrosoftAddress(email)
  if (parsed.error) return { aliases: [], error: parsed.error }

  const count = Math.max(1, Math.floor(Number(quantity) || 0))
  const local = parsed.local.split('+')[0]
  const cleanKeyword = sanitizeAliasToken(keyword) || 'mailrandom'
  const aliases = []
  const seen = new Set()
  let attempts = 0
  const maxAttempts = count * 4 + 100

  while (aliases.length < count && attempts < maxAttempts) {
    const index = aliases.length
    let tag = ''

    if (aliasType === 'Secure Random Number') tag = 'secure-' + randomNumber(10000000, 999999999)
    if (aliasType === 'Serial Number') tag = 'alias-' + serialNumber(index, count)
    if (aliasType === 'Keyword English Words') tag = cleanKeyword + '-' + englishWords[index % englishWords.length] + '-' + serialNumber(Math.floor(index / englishWords.length), count)
    if (aliasType === 'Smart Word + Number') tag = wordAt(index, [cleanKeyword]) + '-' + randomNumber(1000, 999999)

    const alias = local + '+' + tag + '@' + parsed.domain
    if (!seen.has(alias)) {
      seen.add(alias)
      aliases.push(alias)
    }
    attempts += 1
  }

  return { aliases, error: '' }
}
