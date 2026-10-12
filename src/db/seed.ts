import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import { projects, type NewProject } from './schema';

dotenv.config({ path: '.env.local' });
dotenv.config();

const initialProjects: NewProject[] = [
  {
    slug: 'ghidra',
    name: 'Ghidra',
    summary: 'A software reverse engineering (SRE) suite of tools developed by NSA\'s Research Directorate for software analysis including disassembly, assembly, decompilation, and graphing.',
    category: 'Decompiler & Disassembler',
    repositoryUrl: 'https://github.com/NationalSecurityAgency/ghidra',
    websiteUrl: 'https://ghidra-sre.org/',
    license: 'Apache-2.0',
    featured: true,
  },
  {
    slug: 'jadx',
    name: 'JADX',
    summary: 'Dex to Java decompiler with command line and GUI tools for Android APK and DEX file reverse engineering.',
    category: 'Decompiler',
    repositoryUrl: 'https://github.com/skylot/jadx',
    websiteUrl: 'https://jadx.gui.download/',
    license: 'Apache-2.0',
    featured: true,
  },
  {
    slug: 'frida',
    name: 'Frida',
    summary: 'Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers, allowing JavaScript injection into native apps across desktop and mobile platforms.',
    category: 'Dynamic Instrumentation',
    repositoryUrl: 'https://github.com/frida/frida',
    websiteUrl: 'https://frida.re/',
    license: 'wxWindows Library Licence',
    featured: true,
  },
  {
    slug: 'mitmproxy',
    name: 'mitmproxy',
    summary: 'An interactive, SSL/TLS-capable intercepting HTTP proxy for penetration testers and software developers to inspect and modify network traffic.',
    category: 'Network Analysis',
    repositoryUrl: 'https://github.com/mitmproxy/mitmproxy',
    websiteUrl: 'https://mitmproxy.org/',
    license: 'MIT',
    featured: true,
  },
  {
    slug: 'ilspy',
    name: 'ILSpy',
    summary: 'The open-source .NET assembly browser and decompiler with support for C# language decompilation and PDB generation.',
    category: 'Decompiler',
    repositoryUrl: 'https://github.com/icsharpcode/ILSpy',
    websiteUrl: 'https://ilspy.net/',
    license: 'MIT',
    featured: false,
  },
  {
    slug: 'radare2',
    name: 'Radare2',
    summary: 'A free and open-source reverse engineering framework for binary analysis, disassembly, debugging, and patching.',
    category: 'Binary Analysis',
    repositoryUrl: 'https://github.com/radareorg/radare2',
    websiteUrl: 'https://radare.org/',
    license: 'LGPL-3.0',
    featured: false,
  },
];

async function runSeed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('BLOCKED: DATABASE_URL not provided');
    process.exit(1);
  }

  console.log('Connecting to Neon PostgreSQL to seed projects data...');
  const sql = neon(dbUrl);
  const db = drizzle(sql);

  for (const item of initialProjects) {
    await db
      .insert(projects)
      .values(item)
      .onConflictDoUpdate({
        target: projects.slug,
        set: {
          name: item.name,
          summary: item.summary,
          category: item.category,
          repositoryUrl: item.repositoryUrl,
          websiteUrl: item.websiteUrl,
          license: item.license,
          featured: item.featured,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`Successfully seeded ${initialProjects.length} projects.`);
}

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
