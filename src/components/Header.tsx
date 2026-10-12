import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 sticky top-0 z-40">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
          >
            <span className="inline-block rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-mono font-medium text-white dark:bg-neutral-100 dark:text-neutral-950">
              REA
            </span>
            <span>Reverse Engineer Anything</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
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
