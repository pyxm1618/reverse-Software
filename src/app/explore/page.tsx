import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ProjectCard } from '@/components/ProjectCard';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { getAllProjects } from '@/db/queries';
import type { Project } from '@/db/schema';

export const metadata: Metadata = {
  title: 'Explore Projects - Reverse Engineer Anything',
  description: 'Browse the full directory of open-source reverse engineering tools, frameworks, and decompilers.',
};

export default async function ExplorePage() {
  let projects: Project[] = [];
  let hasDbError = false;

  try {
    projects = await getAllProjects();
  } catch (err: unknown) {
    console.error('[ExplorePage DB Query Error]:', err);
    hasDbError = true;
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-900 dark:text-neutral-100">
            Explore Reverse Engineering Projects
          </h1>
          <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-400">
            Browse our catalog of software reverse engineering tools, dynamic debuggers, decompilers, and network traffic interceptors.
          </p>
        </div>

        {hasDbError && <DatabaseNotice />}

        <div className="mt-10">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : !hasDbError ? (
            <div className="rounded-lg border border-dashed border-neutral-300 p-12 text-center text-sm text-neutral-500 dark:border-neutral-800">
              No projects found in database. Run <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">npm run db:seed</code> to populate data.
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
