import { MainNav } from '@/components/layout/MainNav';

export function SiteHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4 px-4 sm:gap-8 sm:px-8">
        <MainNav
          items={[
            {
              title: 'Apps',
              href: '/apps',
            },
            {
              title: 'Games',
              href: '/games',
            },
            {
              title: 'Intelligence',
              href: '/reports',
            },
            {
              title: 'About',
              href: '/about',
            },
            {
              title: 'Support',
              href: '/contact',
            },
          ]}
        />
        <nav className="flex items-center space-x-2">
          {/* Auth buttons removed for AdSense cleanup */}
        </nav>
      </div>
    </header>
  );
}
