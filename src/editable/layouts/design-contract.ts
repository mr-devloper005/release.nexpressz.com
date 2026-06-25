import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#fbfcf7',
  '--slot4-page-text': '#3f4828',
  '--slot4-panel-bg': '#f3f7e6',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6b7445',
  '--slot4-soft-muted-text': '#839705',
  '--slot4-accent': '#6ca651',
  '--slot4-accent-fill': '#839705',
  '--slot4-accent-soft': '#eef3c8',
  '--slot4-dark-bg': '#6b7445',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#eef3dc',
  '--slot4-cream': '#f9fbf2',
  '--slot4-warm': '#f6f9eb',
  '--slot4-lavender': '#eef3dc',
  '--slot4-gray': '#e8edd2',
  '--slot4-line': '#d7e1b2',
  '--slot4-violet': '#6ca651',
  '--slot4-body-gradient': 'linear-gradient(180deg, #fbfcf7 0%, #f8faef 48%, #f1f5df 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent-fill)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--slot4-line)]',
  darkBorder: 'border-white/20',
  shadow: 'shadow-[0_16px_40px_rgba(107,116,69,0.10)]',
  shadowStrong: 'shadow-[0_30px_80px_rgba(107,116,69,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(63,72,40,0.02),rgba(63,72,40,0.62))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start',
    rail: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    minRailCard: 'min-w-0',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.3em]',
    heroTitle: 'text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.55rem]',
    sectionTitle: 'text-3xl font-black leading-[1] tracking-[-0.05em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.warmBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-bold text-white transition hover:translate-y-[-1px] hover:shadow-[0_14px_30px_rgba(131,151,5,0.26)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-accent-fill)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-accent-fill)] transition hover:bg-[var(--slot4-accent-fill)] hover:text-white',
    accent: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-bold text-white transition hover:translate-y-[-1px] hover:shadow-[0_14px_30px_rgba(131,151,5,0.26)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.6rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(107,116,69,0.18)]',
    fade: 'transition duration-300 hover:opacity-90',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use the provided green palette throughout: #6CA651, #BBCB2E, #839705, and #6B7445, with soft tinted backgrounds and restrained editorial contrast.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() or buildPostUrl() for all post links so task-specific detail pages remain functional.',
  'Preserve graceful fallbacks for missing image, summary, category, and metadata fields.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode the reference brand name or logo.',
] as const
