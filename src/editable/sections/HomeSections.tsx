import Link from 'next/link'
import { ArrowRight, CircleCheck, Search, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  getEditableCategory,
  getEditableExcerpt,
  HorizontalFeatureCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function isBlockedMediaNetworkRoute(href: string) {
  return href === '/media-network'
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const showcase = posts[1] || posts[0]
  const heroTitle = pagesContent.home.hero.title.join(' ') || `${SITE_CONFIG.name} for media updates`
  const showPrimaryRouteCta = !isBlockedMediaNetworkRoute(primaryRoute)

  return (
    <section className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-14 sm:py-16 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--slot4-violet)]">
              {pagesContent.home.hero.badge}
            </p>
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-[var(--slot4-page-text)]`}>
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
              {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-4 w-4 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />)}
              <span>Trusted by growing teams</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {showPrimaryRouteCta ? (
                <Link href={primaryRoute} className={dc.button.primary}>
                  View Updates <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link href="/contact" className={dc.button.secondary}>Contact Us</Link>
            </div>
          </div>

          {showcase ? (
            <Link href={postHref(primaryTask, showcase, primaryRoute)} className="group rounded-[2rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
              <div className="p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">{getEditableCategory(showcase)}</p>
                <h2 className="mt-3 text-3xl font-black leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-4xl">
                  {showcase.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(showcase, 150)}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-violet)]">
                  Read more <ArrowRight className="h-4 w-4" />
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(1, 4).length ? posts.slice(1, 4) : posts
  if (!railPosts.length) return null
  const showPrimaryRouteLinks = !isBlockedMediaNetworkRoute(primaryRoute)

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-14 sm:py-16`}>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Scale with confidence</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
              Think of {SITE_CONFIG.name} as an extension of your team
            </h2>
          </div>
          {showPrimaryRouteLinks ? <Link href={primaryRoute} className="hidden text-sm font-semibold text-[var(--slot4-violet)] sm:inline-flex">View all</Link> : null}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[4] || posts[0]
  const checklist = [
    'Fast review and publishing for time-sensitive announcements.',
    'Distribution flow aligned to campaign and category goals.',
    'Readable formatting with safer fallbacks for missing media.',
    'A cleaner public-facing presentation for ongoing updates.',
  ]
  const showPrimaryRouteCta = !isBlockedMediaNetworkRoute(primaryRoute)

  if (!feature) return null

  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${dc.shell.section} py-14 sm:py-16 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Why choose us</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
              Why choose {SITE_CONFIG.name}?
            </h2>
            <div className="mt-8 grid gap-5">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 text-lg leading-8 text-[var(--slot4-muted-text)]">
                  <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-[var(--slot4-violet)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {showPrimaryRouteCta ? <Link href={primaryRoute} className={dc.button.primary}>Get Started</Link> : null}
              <Link href="/contact" className={dc.button.secondary}>Talk to Team</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">
              Featured note
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">
              {feature.title}
            </h3>
            <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">
              {getEditableExcerpt(feature, 170)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(5)
  const sectorLead = source[0] || posts[0]
  const ctaFeature = source[1] || posts[1] || sectorLead
  const latest = source.slice(2, 5).length ? source.slice(2, 5) : posts.slice(2, 5)
  const testimonials = [
    ['We moved from scattered launches to a steadier release rhythm.', 'Founder, B2B SaaS'],
    ['Editorial checks made our campaigns feel more premium.', 'Marketing Lead, D2C'],
    ['Fast turnaround kept the whole team aligned.', 'Growth Manager, Fintech'],
    ['The publishing format made updates easier to trust.', 'Comms Head, Startup Studio'],
  ]
  const showPrimaryRouteLinks = !isBlockedMediaNetworkRoute(primaryRoute)

  if (!sectorLead) return null

  return (
    <>
      <section className="bg-white">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <h2 className="text-center text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
            Digital PR solutions tailored to your industry
          </h2>
          <div className="mt-10 max-w-[24rem]">
            <Link href={postHref(primaryTask, sectorLead, primaryRoute)} className="block rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">{getEditableCategory(sectorLead)}</p>
              <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{sectorLead.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(sectorLead, 130)}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-panel-bg)]">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:px-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Tell us</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">Tell us your story today</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                Share your draft, goals, and timeline. We&apos;ll help shape your next release and distribution plan.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <Link href="/contact" className={dc.button.primary}>
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">Latest Insights</h2>
            {showPrimaryRouteLinks ? <Link href={primaryRoute} className="hidden text-sm font-semibold text-[var(--slot4-violet)] sm:inline-flex">Explore blog</Link> : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {latest.map((post, index) => (
              <ArticleListCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-panel-bg)]">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
            {[
              'How quickly can a release go live?',
              'Can I include images and videos in my release?',
              'Do you support startup launches and funding news?',
              'Will my update appear in searchable archives?',
              'Can I get help with writing and formatting?',
            ].map((item) => (
              <div key={item} className="flex items-center justify-between gap-4 border-t border-[var(--slot4-line)] py-5 first:border-t-0">
                <p className="text-lg font-medium text-[var(--slot4-page-text)]">{item}</p>
                <span className="text-2xl font-light text-[var(--slot4-violet)]">+</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">Latest From Our Newsroom</h2>
            {showPrimaryRouteLinks ? <Link href={primaryRoute} className="hidden text-sm font-semibold text-[var(--slot4-violet)] sm:inline-flex">View all updates</Link> : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <EditorialFeatureCard post={sectorLead} href={postHref(primaryTask, sectorLead, primaryRoute)} label={taskLabel(primaryTask)} />
            {ctaFeature ? <HorizontalFeatureCard post={ctaFeature} href={postHref(primaryTask, ctaFeature, primaryRoute)} label="Editorial Brief" /> : null}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-panel-bg)]">
        <div className={`${dc.shell.section} py-14 sm:py-16`}>
          <h2 className="text-center text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
            {SITE_CONFIG.name} is here to help your business
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map(([quote, role], index) => (
              <article key={`${quote}-${index}`} className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
                <p className="text-base leading-8 text-[var(--slot4-muted-text)]">"{quote}"</p>
                <p className="mt-6 font-black text-[var(--slot4-page-text)]">{role.split(',')[0]}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-violet)]">{role.split(',').slice(1).join(',').trim()}</p>
              </article>
            ))}
          </div>
          {showPrimaryRouteLinks ? (
            <div className="mt-8 text-center">
              <Link href={primaryRoute} className="inline-flex rounded-full border border-[var(--slot4-line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-violet)]">
                Latest News
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="border-t border-[var(--slot4-line)] bg-white">
      <div className={`${dc.shell.section} py-12 sm:py-14`}>
        <form action="/search" className="rounded-[2rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">Search the archive</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-4xl">Find stories, releases, and industry updates faster</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--slot4-muted-text)]">
              Explore every {taskLabel('mediaDistribution').toLowerCase()} post, category, and archive page through one consistent search flow.
            </p>
          </div>
          <label className="mt-6 flex overflow-hidden rounded-full border border-[var(--slot4-line)] bg-white lg:mt-0 lg:min-w-[420px]">
            <Search className="ml-5 mt-4 h-5 w-5 text-[var(--slot4-soft-muted-text)]" />
            <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none" />
            <button className="bg-[var(--slot4-violet)] px-6 text-sm font-bold text-white">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}
