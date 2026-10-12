export function DatabaseNotice() {
  return (
    <div className="my-6 rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      <h3 className="font-semibold text-base mb-2">Database Connection Required</h3>
      <p className="text-sm leading-relaxed mb-4">
        Unable to query the Neon PostgreSQL database. Please ensure DATABASE_URL is properly configured in .env.local and that migrations have been applied.
      </p>
      <div className="text-xs font-mono bg-amber-100/70 dark:bg-neutral-900/80 p-3 rounded border border-amber-200 dark:border-amber-900/50">
        1. Ensure .env.local contains a valid Neon connection string: DATABASE_URL=&quot;postgres://...&quot;<br />
        2. Run: npm run db:migrate &amp;&amp; npm run db:seed
      </div>
    </div>
  );
}
