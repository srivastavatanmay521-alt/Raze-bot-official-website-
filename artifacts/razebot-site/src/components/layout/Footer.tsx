import { Link } from "wouter"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12 mt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left mx-auto md:mx-0">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            The ultimate cyber-command center for Discord power users. Fast, precise, and sleek.
          </p>
        </div>
        <div className="flex gap-16 mx-auto md:mx-0">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground tracking-wide uppercase text-sm">Platform</h4>
            <Link href="/partners" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partners</Link>
            <a href="/#stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">Statistics</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Invite Bot</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground tracking-wide uppercase text-sm">Legal</h4>
            <Link href="/tos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/tos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground font-mono">
        © {new Date().getFullYear()} razebot.site. All rights reserved.
      </div>
    </footer>
  )
}
