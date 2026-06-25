'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const primaryTask = SITE_CONFIG.tasks.find((task) => task.enabled)
  const categories = [primaryTask?.label, 'Business', 'Editorial'].filter(Boolean) as string[]

  return (
    <footer className="bg-white">
      <section className="border-y border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Client voices</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
              {SITE_CONFIG.name} helps your updates land with clarity
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Predictable coverage and a calmer publishing rhythm.', 'Editorial Lead, Consumer Brand'],
              ['Distribution quality feels premium from the first draft.', 'Marketing Director, Services'],
              ['Fast turnaround keeps launch timelines moving.', 'Growth Manager, SaaS'],
              ['The format makes announcements easier to read and trust.', 'Comms Team, Studio'],
            ].map(([quote, role]) => (
              <article key={quote} className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
                <p className="text-base leading-8 text-[var(--slot4-muted-text)]">"{quote}"</p>
                <p className="mt-6 font-black text-[var(--slot4-page-text)]">{role.split(',')[0]}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-violet)]">{role.split(',').slice(1).join(',').trim()}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-[var(--slot4-line)] pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/" className="editorial-brand text-4xl font-semibold text-[var(--slot4-page-text)]">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">
              {globalContent.footer.description || SITE_CONFIG.description}
            </p>
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              © {year} {SITE_CONFIG.name}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-[var(--slot4-page-text)]">
            <Link href="/about" className="hover:text-[var(--slot4-violet)]">About</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-violet)]">Contact</Link>
            <Link href="/about" className="hover:text-[var(--slot4-violet)]">Privacy</Link>
            <Link href="/about" className="hover:text-[var(--slot4-violet)]">Terms</Link>
          </div>
        </div>

        <div className="pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-soft-muted-text)]">Categories</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--slot4-muted-text)]">
            {categories.map((item) => (
              <span key={item}>∨ {item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
