import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  variant: 'header' | 'footer';
}

export function BrandLogo({ variant }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Reverse Engineer Anything home"
      className="inline-flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight text-neutral-900 transition-colors hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-neutral-100 dark:hover:text-neutral-300"
    >
      <picture className="shrink-0 overflow-hidden rounded-md bg-white">
        <source
          type="image/webp"
          srcSet="/brand/logo-128.webp 1x, /brand/logo-256.webp 2x"
        />
        <Image
          src="/brand/logo.png"
          alt=""
          width={256}
          height={186}
          unoptimized
          loading="eager"
          className={variant === 'header' ? 'h-9 w-auto' : 'h-8 w-auto'}
        />
      </picture>
      <span className="hidden sm:inline">Reverse Engineer Anything</span>
      <span className="sm:hidden">REA</span>
    </Link>
  );
}
