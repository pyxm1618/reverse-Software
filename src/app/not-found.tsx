import Link from 'next/link';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 text-center">
      <Container>
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-sm font-semibold tracking-wide uppercase text-neutral-500">404 Error</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            Project Not Found
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The project or resource you requested could not be found in our directory.
          </p>
          <div className="pt-4">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
