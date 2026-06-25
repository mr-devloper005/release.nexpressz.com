'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaign planning.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or broader site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--slot4-violet)]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.4rem]">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <aside className="grid gap-4 self-start">
              {desks.map((desk, index) => (
                <div key={desk.title} className="rounded-[1.7rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)] sm:p-6">
                  <div className="flex items-center justify-between">
                    <desk.icon className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{desk.body}</p>
                </div>
              ))}
            </aside>

            <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Send a message</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-4xl">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
