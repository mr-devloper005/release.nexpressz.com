import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-violet)]">{pagesContent.auth.signup.badge}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.2rem]">{pagesContent.auth.signup.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="rounded-[2rem] border border-[var(--slot4-line)] bg-white p-6 shadow-[0_18px_40px_rgba(107,116,69,0.10)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">Create account</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{pagesContent.auth.signup.formTitle}</h2>
              <EditableLocalSignupForm />
              <p className="mt-6 border-t border-[var(--slot4-line)] pt-5 text-sm text-[var(--slot4-muted-text)]">
                Already have an account? <Link href="/login" className="font-bold text-[var(--slot4-accent-fill)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--slot4-line)] bg-[var(--slot4-warm)] p-6 shadow-[0_12px_30px_rgba(107,116,69,0.08)] sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-violet)]">Publishing access</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">Everything starts with one account</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
                Create your account to access the publishing workspace, save your details, and manage submissions from one place.
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
