import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FlyingCartItem from './FlyingCartItem'
import Footer from './Footer'
import Header from './Header'

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>
      <Header />
      <RouteAnnouncer />
      <div id="main-content" className="app-shell-content" tabIndex="-1">
        {children}
      </div>
      <Footer />
      <FlyingCartItem />
    </div>
  )
}

function RouteAnnouncer() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
