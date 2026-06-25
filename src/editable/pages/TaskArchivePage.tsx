import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => getEditableExcerpt(post, 180)
const fieldOf = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

function isBlockedMediaNetworkRoute(href: string) {
  return href === '/media-network'
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; badge: string }> = {
  mediaDistribution: { icon: Newspaper, badge: 'Newswire' },
  article: { icon: FileText, badge: 'Editorial' },
  listing: { icon: Building2, badge: 'Directory' },
  classified: { icon: Megaphone, badge: 'Classified' },
  image: { icon: Camera, badge: 'Gallery' },
  sbm: { icon: Bookmark, badge: 'Bookmarks' },
  pdf: { icon: Download, badge: 'PDF' },
  profile: { icon: UserRound, badge: 'Profiles' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': '#fbfcf7', '--archive-text': '#3f4828', '--archive-surface': '#ffffff', '--archive-accent': '#839705' } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getEditableCategory(post)
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const secondary = posts.slice(1, 4)
  const remaining = posts.slice(4)
  const showBasePathLinks = !isBlockedMediaNetworkRoute(basePath)

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-line)] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">
                <Icon className="h-4 w-4" /> {voice.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.06em] sm:text-6xl">
                {voice.headline}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                {voice.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-[var(--slot4-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <form action={basePath} className="self-end rounded-[2rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">
                <Filter className="h-4 w-4" /> {voice.filterLabel}
              </div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-[1.1rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] px-4 text-sm font-medium outline-none">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-[1.1rem] bg-[var(--slot4-violet)] text-sm font-bold text-white">Apply Filter</button>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        {lead ? (
          <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <Link href={`${basePath}/${lead.slug}`} className="group rounded-[2rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
                <div className="overflow-hidden rounded-[1.55rem] bg-[var(--slot4-media-bg)]">
                  <img src={getEditablePostImage(lead)} alt={lead.title} className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-2 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--archive-accent)]">{getEditableCategory(lead)}</p>
                  <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[var(--slot4-page-text)]">{lead.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryOf(lead)}</p>
                </div>
              </Link>
              <div className="grid gap-5">
                {secondary.map((post, index) => (
                  <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group grid rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_12px_30px_rgba(107,116,69,0.08)] sm:grid-cols-[170px_1fr]">
                    <div className="overflow-hidden rounded-[1.3rem] bg-[var(--slot4-media-bg)]">
                      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="min-w-0 py-1 sm:px-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">{deck.badge} {String(index + 1).padStart(2, '0')}</p>
                      <h3 className="mt-3 text-2xl font-black leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--archive-accent)]">Latest from our newsroom</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">
                Curated {label.toLowerCase()} updates
              </h2>
            </div>
            {showBasePathLinks ? <Link href={basePath} className="text-sm font-semibold text-[var(--archive-accent)]">View all updates</Link> : null}
          </div>

          {remaining.length ? (
            <div className={task === 'image' ? 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3' : 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'}>
              {remaining.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : !lead ? (
            <div className="rounded-[2rem] border border-dashed border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try another category or check back after new content is published.</p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--slot4-line)] bg-white px-5 py-3 text-sm font-semibold">Previous</Link> : null}
            <span className="rounded-full bg-[var(--slot4-violet)] px-5 py-3 text-sm font-bold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--slot4-line)] bg-white px-5 py-3 text-sm font-semibold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}`
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="overflow-hidden rounded-[1.35rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-2 pt-5">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--slot4-violet)]">
          <span>{getEditableCategory(post)}</span>
          <span>{String(index + 5).padStart(2, '0')}</span>
        </div>
        <h2 className="mt-4 text-2xl font-black leading-[1.06] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getEditablePostImage(post)
  const location = fieldOf(post, ['location', 'address', 'city'])
  const phone = fieldOf(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[var(--slot4-warm)] ring-1 ring-[var(--slot4-line)]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-[var(--slot4-soft-muted-text)]" />}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--slot4-line)] px-3 py-1 text-[11px] font-medium text-[var(--slot4-muted-text)]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
        {phone ? <p className="mt-4 text-sm font-medium text-[var(--slot4-page-text)]">Phone: {phone}</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = fieldOf(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = fieldOf(post, ['location', 'address', 'city']) || 'Details inside'
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.9rem] border border-[var(--slot4-line)] bg-white shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="grid sm:grid-cols-[0.82fr_1.18fr]">
        <div className="bg-[var(--slot4-panel-bg)] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-violet)]">Classified</p>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">{price}</h2>
          <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">{location}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-violet)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-3 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <img src={getEditablePostImage(post)} alt={post.title} className={index % 3 === 0 ? 'aspect-[4/5] w-full rounded-[1.35rem] object-cover' : 'aspect-[4/3] w-full rounded-[1.35rem] object-cover'} />
      <div className="p-2 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-violet)]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--slot4-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-violet)]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5 text-[var(--slot4-violet)]" />
      </div>
      <h2 className="mt-8 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-panel-bg)] p-5 text-[var(--slot4-violet)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">PDF</span>
      </div>
      <h2 className="mt-8 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = fieldOf(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[1.9rem] border border-[var(--slot4-line)] bg-white p-6 text-center shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-warm)] ring-1 ring-[var(--slot4-line)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-5 text-xl font-black tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h2>
      {role ? <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-violet)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p>
    </Link>
  )
}
