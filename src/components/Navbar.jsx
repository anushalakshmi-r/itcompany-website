import { useState } from 'react'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About us' },
  { href: '#faq', label: 'FAQ' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function scrollToSection(event, href) {
    event.preventDefault()
    closeMenu()
    document.getElementById(href.slice(1))?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
    window.history.pushState(null, '', href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101c19]/95 text-white backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12"
      >
        <a
          className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7f47b]"
          href="#hero"
          onClick={(event) => scrollToSection(event, '#hero')}
          aria-label="Northstar IT home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#c7f47b] text-lg font-bold text-[#14211b]">
            n.
          </span>
          <span className="text-sm font-semibold tracking-wide">
            northstar<span className="text-[#c7f47b]">.</span>
          </span>
        </a>

        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="grid size-10 place-items-center rounded-full border border-white/15 text-lg transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f47b] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? '×' : '☰'}
        </button>

        <div
          id="primary-navigation"
          className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b border-white/10 bg-[#101c19] px-6 py-4 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:text-[#c7f47b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f47b] md:px-0"
              href={link.href}
              onClick={(event) => scrollToSection(event, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#14211b] transition hover:bg-[#c7f47b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7f47b] md:ml-2 md:mt-0"
            href="#contact"
            onClick={(event) => scrollToSection(event, '#contact')}
          >
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
