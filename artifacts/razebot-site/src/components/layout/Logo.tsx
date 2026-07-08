import { cn } from "../ui/shared"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_0_15px_rgba(108,99,255,0.4)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white drop-shadow-md">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-wide text-foreground">
        Raze<span className="text-primary">Bot</span>
      </span>
    </div>
  )
}
