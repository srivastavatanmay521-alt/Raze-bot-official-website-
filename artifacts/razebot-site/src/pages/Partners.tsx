import { motion } from "framer-motion"
import { useGetPartners } from "@workspace/api-client-react"
import { Card } from "@/components/ui/shared"
import { ExternalLink, Users, Handshake } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
}

export function Partners() {
  const { data: partners, isLoading } = useGetPartners()

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Handshake size={16} />
              Official Network
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-5">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Partners
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Trusted communities and projects that share RazeBot's values. Join them and level up your Discord experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 bg-card rounded-2xl border border-border/50" />
              ))}
            </div>
          ) : !partners?.length ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                >
                  <PartnerCard partner={partner} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Have a thriving community? Partner with RazeBot and get featured here. Reach out in our support server.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Apply for Partnership
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function PartnerCard({ partner }: { partner: {
  id: string
  name: string
  description: string
  inviteUrl: string
  iconUrl?: string | null
  memberCount?: string | null
}}) {
  return (
    <Card className="group p-6 bg-card/40 border-border/50 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
          {partner.iconUrl ? (
            <img src={partner.iconUrl} alt={partner.name} className="h-full w-full object-cover rounded-2xl" />
          ) : (
            <span className="text-2xl font-black text-primary select-none">{partner.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-foreground leading-tight truncate">{partner.name}</h3>
          {partner.memberCount && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs font-mono">
              <Users size={12} />
              {partner.memberCount}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 line-clamp-3">
        {partner.description}
      </p>

      <a
        href={partner.inviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border/60 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
        data-testid={`link-invite-${partner.id}`}
      >
        Join Server
        <ExternalLink size={14} />
      </a>
    </Card>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Handshake size={36} className="text-primary/60" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No Partners Yet</h3>
      <p className="text-muted-foreground max-w-sm text-base">
        We're actively building our partner network. Check back soon or apply to be the first partner.
      </p>
    </motion.div>
  )
}
