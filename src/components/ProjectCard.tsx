import Link from 'next/link';
import type { Project } from '@/db/schema';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div>
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="text-base font-semibold text-neutral-900 hover:underline dark:text-neutral-100"
          >
            {project.name}
          </Link>
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 whitespace-nowrap">
            {project.category}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
          {project.summary}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <div>
          {project.license ? (
            <span>License: {project.license}</span>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600">No license specified</span>
          )}
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="font-medium text-neutral-900 hover:text-neutral-700 dark:text-neutral-200 dark:hover:text-white"
        >
          View details &rarr;
        </Link>
      </div>
    </div>
  );
}
