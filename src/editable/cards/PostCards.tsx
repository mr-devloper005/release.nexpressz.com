import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo', 'avatar']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean || 'Explore the full update for the latest details and release-ready context.'
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured brief' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block rounded-[2rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_18px_40px_rgba(107,116,69,0.10)]">
      <div className="overflow-hidden rounded-[1.6rem]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="p-2 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">{label}</p>
        <h3 className="editorial-serif mt-3 text-3xl font-black leading-[1.04] tracking-[-0.045em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 160)}</p>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-0 shadow-[0_12px_30px_rgba(107,116,69,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(107,116,69,0.14)]">
      <div className="overflow-hidden rounded-t-[1.8rem]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--slot4-violet)]">
          <span>{getEditableCategory(post)}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="mt-4 line-clamp-3 text-2xl font-black leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[44px_1fr] gap-4 border-t border-[var(--slot4-line)] py-5 first:border-t-0">
      <span className="text-3xl font-black leading-none text-[var(--slot4-violet)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">
          <Clock3 className="h-3 w-3" /> {getEditableCategory(post)}
        </p>
        <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-violet)]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-5 rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-4 shadow-[0_12px_30px_rgba(107,116,69,0.08)] sm:grid-cols-[240px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[1.35rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/11] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--slot4-violet)]">{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-3xl font-black leading-[1.04] tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-violet)]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function HorizontalFeatureCard({ post, href, label = 'Distribution' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-[var(--slot4-line)] bg-white shadow-[0_18px_40px_rgba(107,116,69,0.10)] lg:grid-cols-[1.08fr_0.92fr]">
      <div className="overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">{label}</p>
        <h3 className="mt-4 text-3xl font-black leading-[1.04] tracking-[-0.045em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 170)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-violet)]">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[var(--slot4-line)] bg-white p-3 shadow-[0_12px_30px_rgba(107,116,69,0.08)]">
      <div className="overflow-hidden rounded-[1.35rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="px-2 pb-2 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-xl font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}
