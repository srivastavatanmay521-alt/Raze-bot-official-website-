import { Link, useLocation } from "wouter"
import { Logo } from "./Logo"
import { Button } from "../ui/shared"
import { cn } from "../ui/shared"

export function Navbar() {
  const [location] = useLocation()

  const links = [
    { href: "/", label: "Home" },
    { href: "/partners", label: "Partners" },
    { href: "/tos", label: "TOS" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/">
          <Logo className="cursor-pointer" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link key={link.href} href={link.href} className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location === link.href ? "text-primary" : "text-muted-foreground"
            )}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="gradient" className="hidden sm:flex" asChild>
            <a href="#">Add to Discord</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
