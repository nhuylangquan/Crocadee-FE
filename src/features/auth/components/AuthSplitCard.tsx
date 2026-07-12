import type { ReactNode } from 'react';
import codebiteLogoUrl from '../../../assets/logo/Codebite logo.svg';
import authBgUrl from '../../../assets/images/auth_bg.png';

interface AuthSplitCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthSplitCard({
  title,
  subtitle,
  children,
  footer,
}: AuthSplitCardProps) {
  return (
    <main className="flex min-h-[100dvh] w-full bg-shade-white font-sans dark:bg-shade-black">
      {/* Left visual side */}
      <section className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-10 bg-neutral-900/5 mix-blend-multiply" />
        <img
          src={authBgUrl}
          alt="Abstract architectural background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 z-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
            CodeBite Identity
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-medium leading-tight text-white">
            Secure access to your coding journey and personal learning roadmap.
          </h2>
        </div>
      </section>

      {/* Right content side */}
      <section className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-left">
            <img
              src={codebiteLogoUrl}
              alt="CodeBite logo"
              className="mb-8 h-12 w-12 object-contain"
            />
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-shade-white">
              {title}
            </h1>
            <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </p>
          </div>

          <div className="w-full">{children}</div>

          <div className="mt-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
