import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const summaryText = (post: SitePost) => getEditableExcerpt(post, 210)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-white text-[var(--slot4-page-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-violet)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  return (
    <section className="bg-white">
      <header className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <BackLink task={task} />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]">
            <span className="rounded-full bg-white px-4 py-2 text-[var(--slot4-violet)]">{getEditableCategory(post)}</span>
            {published ? <time className="text-[var(--slot4-soft-muted-text)]">{published}</time> : null}
          </div>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.055em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[4.7rem]">{post.title}</h1>
          <p className="mt-6 max-w-4xl text-xl leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
        </div>
      </header>

      {images[0] ? (
        <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
            <img src={images[0]} alt={post.title} className="max-h-[760px] w-full rounded-[1.55rem] object-cover" />
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8 lg:py-14">
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task={task} post={post} related={related} />
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
          <HeroCard post={post} label="Business listing" />
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-[2rem] border border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)] p-7 lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">Classified notice</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h1>
          <div className="mt-6 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
        </aside>
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </div>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-7 shadow-[0_18px_40px_rgba(107,116,69,0.10)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-violet)]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-3 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
              <img src={image} alt={post.title} className="w-full rounded-[1.3rem] object-cover" />
              {index === 0 ? <figcaption className="p-3 text-sm text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-8"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-7 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-9">
          <BackLink task="sbm" />
          <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-[var(--slot4-panel-bg)] text-[var(--slot4-violet)]"><Bookmark className="h-9 w-9" /></div>
          <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-violet)] px-5 py-3 text-sm font-bold text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </div>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
          <BackLink task="pdf" />
          <HeroCard post={post} label="PDF resource" icon={<FileText className="h-10 w-10 text-[var(--slot4-violet)]" />} />
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[var(--slot4-line)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-4">
                <span className="text-sm font-semibold text-[var(--slot4-page-text)]">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-violet)] px-4 py-2 text-sm font-bold text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-8 text-center shadow-[0_18px_40px_rgba(107,116,69,0.10)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className="mx-auto mt-8 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-warm)] ring-1 ring-[var(--slot4-line)]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--slot4-soft-muted-text)]" />}
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h1>
          {role ? <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-violet)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-7 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-9">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </div>
    </section>
  )
}

function HeroCard({ post, label, icon }: { post: SitePost; label: string; icon?: ReactNode }) {
  return (
    <div className="rounded-[1.8rem] bg-[var(--slot4-panel-bg)] p-6">
      {icon ? <div className="mb-4">{icon}</div> : null}
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">{label}</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">{post.title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm leading-7 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.2rem] object-cover ring-1 ring-[var(--slot4-line)]" />)}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-violet)] px-4 py-2 text-sm font-bold text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-line)] px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-line)] px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--slot4-line)] bg-white px-4 py-3 text-sm"><span className="font-semibold uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">{label}</span><span className="font-bold text-[var(--slot4-page-text)]">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="space-y-5">
      {!compact ? (
        <div className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-5 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-sm font-semibold text-[var(--slot4-violet)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group grid gap-3 rounded-[1.3rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-3 sm:grid-cols-[92px_1fr]">
      <div className="overflow-hidden rounded-[1rem] bg-white">
        {task !== 'sbm' ? <img src={image} alt={post.title} className="aspect-[4/3] h-full w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-[var(--slot4-panel-bg)] text-[var(--slot4-violet)]"><FileText className="h-6 w-6" /></div>}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-6 tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[1.8rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-5">
      <div className="flex items-center gap-2 text-xl font-black text-[var(--slot4-page-text)]"><MessageCircle className="h-5 w-5 text-[var(--slot4-violet)]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.1rem] border border-[var(--slot4-line)] bg-white p-4">
            <p className="text-sm font-bold text-[var(--slot4-page-text)]">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
