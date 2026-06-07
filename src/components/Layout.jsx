import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

function ScrollToRoute() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

  return null
}

export function Layout() {
  return (
    <div className='min-h-screen bg-paper text-ink'>
      <ScrollToRoute />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

