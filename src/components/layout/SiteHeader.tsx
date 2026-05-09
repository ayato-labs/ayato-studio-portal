import { MainNav } from "@/components/layout/MainNav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 justify-between sm:gap-8 px-4 sm:px-8">
        <MainNav
          items={[
              {
                title: "Apps",
                href: "/apps",
              },
              {
                title: "Reports",
                href: "/reports",
              },
              {
                title: "Academy",
                href: "/academy",
              },
              {
                title: "Blog",
                href: "/blog",
              },
              {
                title: "Services",
                href: "/services",
              },
              {
                title: "About",
                href: "/about",
              },
              {
                title: "Contact",
                href: "/contact",
              },
              {
                title: "Support",
                href: "/support",
              },
          ]}
        />
        <nav className="flex items-center space-x-2">
          {/* Auth buttons removed for AdSense cleanup */}
        </nav>
      </div>
    </header>
  )
}
