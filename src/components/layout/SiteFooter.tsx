import * as React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 px-8 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-4 md:px-0">
          <Icons.logo />
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} Ayato Studio.
          </p>
          <nav className="text-muted-foreground flex items-center gap-4 text-sm font-medium">
            <Link href="/academy" className="hover:text-foreground transition-colors">
              Academy
            </Link>
            <Link href="/apps/site-downloader" className="hover:text-foreground transition-colors">
              Site Downloader
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <a
              href="https://note.com/ayato_studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              note.com
            </a>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </nav>
        </div>
        <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
          &copy; {new Date().getFullYear()} Ayato Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
