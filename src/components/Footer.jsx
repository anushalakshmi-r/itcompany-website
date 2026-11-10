const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="bg-[#101c19] px-6 py-8 text-white sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <a className="font-semibold tracking-wide text-white" href="#hero">
          northstar<span className="text-[#c7f47b]">.</span>
        </a>
        <p>Thoughtful technology for what comes next.</p>
        <p>© {currentYear} Northstar IT</p>
      </div>
    </footer>
  )
}

export default Footer
