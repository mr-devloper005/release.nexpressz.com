'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function usePrimaryRoute() {
  return useMemo(() => SITE_CONFIG.tasks.find((task) => task.enabled)?.route || '/', [])
}

function isBlockedMediaNetworkRoute(href: string) {
  return href === '/media-network'
}

function BrandMark() {
  const initials = SITE_CONFIG.name.trim().charAt(0).toUpperCase() || 'S'
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--slot4-line)] bg-[var(--slot4-warm)] text-2xl font-black text-[var(--slot4-violet)]">
      {initials}
    </span>
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const primaryRoute = usePrimaryRoute()
  const utilityLinks = [
    { label: globalContent.nav.tagline || SITE_CONFIG.tagline, href: primaryRoute },
    { label: 'About Us', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ].filter((item) => !isBlockedMediaNetworkRoute(item.href))
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Updates', href: primaryRoute },
    { label: 'Contact', href: '/contact' },
  ].filter((item) => !isBlockedMediaNetworkRoute(item.href))

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--slot4-line)] bg-white/95 backdrop-blur">
      <div className="border-b border-[var(--slot4-line)] bg-[var(--slot4-warm)]">
        <div className="mx-auto hidden max-w-[1280px] items-center justify-between gap-6 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] lg:flex">
          {utilityLinks.map((item) => (
            <Link key={`${item.label}-${item.href}`} href={item.href} className="hover:text-[var(--slot4-violet)]">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="editorial-frame grid items-center gap-4 px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:px-5 lg:px-6">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <span className="editorial-brand truncate text-3xl font-semibold text-[var(--slot4-page-text)] sm:text-[2.2rem]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--slot4-line)] text-[var(--slot4-violet)] sm:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav className="hidden items-center justify-center gap-3 sm:flex">
            {navLinks.map((item, index) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={index === 0
                  ? 'rounded-full bg-[var(--slot4-violet)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white'
                  : 'rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-violet)]'}
              >
                {item.label}
              </Link>
            ))}
            <form action="/search" className="ml-1">
              <button type="submit" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--slot4-line)] text-[var(--slot4-violet)] transition hover:bg-[var(--slot4-warm)]" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </nav>

          <div className="hidden items-center justify-end gap-3 sm:flex">
            {session ? (
              <>
                <Link href="/create" className="rounded-full border border-[var(--slot4-line)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-violet)] hover:text-[var(--slot4-violet)]">
                  Publish
                </Link>
                <button type="button" onClick={logout} className="rounded-full bg-[var(--slot4-violet)] px-5 py-3 text-sm font-bold text-white transition hover:translate-y-[-1px]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-[var(--slot4-line)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-violet)] hover:text-[var(--slot4-violet)]">
                  Login
                </Link>
                <Link href="/signup" className="rounded-full bg-[var(--slot4-violet)] px-5 py-3 text-sm font-bold text-white transition hover:translate-y-[-1px]">
                  Register
                </Link>
              </>
            )}
          </div>

          {open ? (
            <div className="sm:hidden">
              <div className="mt-2 grid gap-2 border-t border-[var(--slot4-line)] pt-4">
                {navLinks.map((item) => (
                  <Link key={`${item.label}-${item.href}-mobile`} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-[var(--slot4-line)] px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                    {item.label}
                  </Link>
                ))}
                <Link href="/search" onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-[var(--slot4-line)] px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                  Search
                </Link>
                {session ? (
                  <>
                    <Link href="/create" onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-[var(--slot4-line)] px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                      Publish
                    </Link>
                    <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-[1.2rem] bg-[var(--slot4-violet)] px-4 py-3 text-left text-sm font-bold text-white">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-[var(--slot4-line)] px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)} className="rounded-[1.2rem] bg-[var(--slot4-violet)] px-4 py-3 text-sm font-bold text-white">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
