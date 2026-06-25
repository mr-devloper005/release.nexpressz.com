import Link from 'next/link'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  const points = [
    'A homepage and archive flow designed to feel polished and easy to scan.',
    'Connected content types that stay readable across articles, visuals, and resources.',
    'A calmer visual rhythm that helps public updates feel more trustworthy.',
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--slot4-violet)]">
                {pagesContent.about.badge}
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.4rem]">
                {pagesContent.about.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                {pagesContent.about.description}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">
                About {SITE_CONFIG.name}
              </p>
              <div className="mt-6 space-y-5">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-8 text-[var(--slot4-muted-text)]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">
                  Why it works
                </p>
                <div className="mt-4 grid gap-4">
                  {points.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-base leading-7 text-[var(--slot4-muted-text)]">
                      <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-[var(--slot4-accent-fill)]" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[1.7rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)] sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">
                    0{index + 1}
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">
                    {value.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="border-t border-[var(--slot4-line)] bg-white">
          <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)] px-6 py-8 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:px-8 lg:flex lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">
                  Explore more
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-4xl">
                  Keep reading the stories and updates shaping the conversation.
                </h2>
              </div>
              <div className="mt-6 lg:mt-0">
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold text-white">
                  Explore the archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
