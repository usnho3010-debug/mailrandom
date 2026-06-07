import { useEffect, useMemo, useState } from 'react'
import { getTranslation } from '../data/i18n'
import { LanguageContext, STORAGE_KEY } from './languageStore'

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'vi') return stored

  const browserLanguage = window.navigator.language || ''
  return browserLanguage.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language === 'vi' ? 'vi' : 'en'
  }, [language])

  const value = useMemo(() => {
    const translation = getTranslation(language)

    return {
      language,
      translation,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'vi' : 'en')),
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
