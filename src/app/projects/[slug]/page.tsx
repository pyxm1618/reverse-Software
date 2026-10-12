import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { getProjectBySlug } from '@/db/queries';
import type { Project } from '@/db/schema';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      return {
        title: 'Project Not Found - Reverse Engineer Anything',
      };
    }
    return {
      title: `${project.name} - Reverse Engineer Anything`,
      description: project.summary,
    };
  } catch {
    return {
      title: 'Project Details - Reverse Engineer Anything',
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  let project: Project | null = null;
  let dbError: string | null = null;

  try {
    project = await getProjectBySlug(slug);
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : 'Failed to query Neon PostgreSQL database.';
  }

  if (dbError) {
    return (
      <div className="py-12 sm:py-16">
        <Container>
          <div className="mb-6">
            <Link
              href="/explore"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              &larr; Back to Explore
            </Link>
          </div>
          <DatabaseNotice error={dbError} />
        </Container>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="mb-8">
          <Link
            href="/explore"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            &larr; Back to Explore
          </Link>
        </div>

        <article className="max-w-3xl space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {project.category}
              </span>
              {project.license && (
                <span className="rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                  License: {project.license}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-neutral-100">
              {project.name}
            </h1>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/30">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Summary
            </h2>
            <p className="mt-2 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
              {project.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Source Repository
              </h3>
              <div className="mt-2">
                {project.repositoryUrl ? (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 break-all"
                  >
                    {project.repositoryUrl}
                  </a>
                ) : (
                  <span className="text-sm text-neutral-400">Not specified</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Official Website
              </h3>
              <div className="mt-2">
                {project.websiteUrl ? (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 break-all"
                  >
                    {project.websiteUrl}
                  </a>
                ) : (
                  <span className="text-sm text-neutral-400">Not specified</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 text-xs text-neutral-400 dark:border-neutral-800">
            <span>Identifier (slug): </span>
            <code className="font-mono text-neutral-600 dark:text-neutral-300">{project.slug}</code>
          </div>
        </article>
      </Container>
    </div>
  );
}
