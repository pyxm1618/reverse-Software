import { Container } from './Container';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 py-10 dark:border-neutral-800 dark:bg-neutral-900/50">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <div className="space-y-1">
            <p className="font-medium text-neutral-900 dark:text-neutral-200">
              Reverse Engineer Anything
            </p>
            <p className="text-xs text-neutral-500">
              An open directory of software reverse engineering tools and projects.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/pyxm1618/reverse-Software"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200/60 pt-6 text-xs text-neutral-500 dark:border-neutral-800/60">
          <p>
            Disclaimer: Reverse Engineer Anything is an independent directory and project index. 
            It is not affiliated with, endorsed by, or the official website of Ghidra, Frida, JADX, mitmproxy, ILSpy, or any third-party projects listed. All trademarks and project names belong to their respective owners.
          </p>
        </div>
      </Container>
    </footer>
  );
}
