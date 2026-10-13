import Link from 'next/link';
import { Container } from './Container';
import { BrandLogo } from './BrandLogo';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 sticky top-0 z-40">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3">
          <BrandLogo variant="header" />

          <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-4 text-sm font-medium sm:gap-6">
            <Link
              href="/explore"
              className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              Explore
            </Link>
            <a
              href="https://github.com/pyxm1618/reverse-Software"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1"
            >
              GitHub
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
