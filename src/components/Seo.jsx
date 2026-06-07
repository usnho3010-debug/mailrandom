import { useEffect } from 'react'
import { brand } from '../data/tools'

const defaultDescription = 'MailRandom provides free browser-based email and web tools for aliases, extraction, QR codes, and bulk URL opening.'

export function Seo({ title, description = defaultDescription }) {
  useEffect(() => {
    document.title = title ? title + ' | ' + brand.name : brand.name + ' - ' + brand.slogan

    let meta = document.querySelector('meta[name=description]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [title, description])

  return null
}

