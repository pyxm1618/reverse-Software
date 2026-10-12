import Link from 'next/link';
import { Container } from '@/components/Container';
import { ProjectCard } from '@/components/ProjectCard';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { getFeaturedProjects } from '@/db/queries';
import type { Project } from '@/db/schema';

export default async function HomePage() {
  let featuredProjects: Project[] = [];
  let dbError: string | null = null;

  try {
    featuredProjects = await getFeaturedProjects();
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : 'Failed to connect to Neon database.';
  }

  const categories = [
    {
      name: 'Decompilers & Disassemblers',
      description: 'Tools that translate machine code or bytecode into readable source representations.',
    },
    {
      name: 'Dynamic Instrumentation',
      description: 'Inject scripts and observe runtime memory, hooks, and native function calls.',
    },
    {
      name: 'Network Analysis',
      description: 'Intercept, inspect, and modify encrypted network traffic and protocol streams.',
    },
    {
      name: 'Binary Analysis Frameworks',
      description: 'Inspect executable formats, symbols, control flow graphs, and low-level binaries.',
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Reverse Engineer Anything
          </h1>
          <p className="text-base text-neutral-600 sm:text-lg dark:text-neutral-400">
            A curated directory and discovery index for software reverse engineering tools, decompilers, dynamic instrumentation, and binary inspection frameworks.
          </p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Browse All Projects &rarr;
            </Link>
          </div>
        </div>

        {/* Database Notice if DATABASE_URL is missing or failed */}
        {dbError && <DatabaseNotice error={dbError} />}

        {/* Featured Projects Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Featured Projects
            </h2>
            <Link
              href="/explore"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              View all &rarr;
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : !dbError ? (
            <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
              No featured projects found. Please run the seed script to populate the database.
            </div>
          ) : null}
        </div>

        {/* Categories / What You Can Explore */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
            Categories &amp; Tooling Domains
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/30"
              >
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Simple CTA */}
        <div className="mt-16 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Explore the Directory
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
            Inspect our project index to find tools for Android, .NET, native binaries, and network reverse engineering.
          </p>
          <div className="mt-5">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
