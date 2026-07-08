import { motion } from "framer-motion"
import { Button, Card, cn } from "@/components/ui/shared"
import { useGetBotStats, useGetCommands, useGetAnnouncements } from "@workspace/api-client-react"
import { Terminal, Zap, Shield, Cpu, Activity, Info, AlertTriangle, Wrench } from "lucide-react"

export function Home() {
  const { data: stats, isLoading: statsLoading } = useGetBotStats()
  const { data: commandCategories, isLoading: cmdsLoading } = useGetCommands()
  const { data: announcements, isLoading: annLoading } = useGetAnnouncements()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight">
              Command Your Server With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Absolute Precision</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              RazeBot is the ultimate cyber-command center for Discord. Lightning fast moderation, extensive utilities, and a sleek experience for power users.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="gradient" asChild>
                <a href="#">Add to Discord</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#commands">View Commands</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <section id="stats" className="border-y border-border bg-card/30 py-12 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/50">
            <StatBlock label="Active Servers" value={stats?.servers} loading={statsLoading} icon={Shield} />
            <StatBlock label="Global Users" value={stats?.users} loading={statsLoading} icon={Terminal} />
            <StatBlock label="Commands Run" value={stats?.commandsRun} loading={statsLoading} icon={Zap} />
            <StatBlock label="System Uptime" value={stats?.uptime} loading={statsLoading} icon={Activity} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight">Engineered for Performance</h2>
            <p className="text-muted-foreground mt-4 text-lg">Everything you need, nothing you don't.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="Lightning Fast" 
              desc="Built on a high-performance infrastructure ensuring near zero-latency command execution and response times." 
            />
            <FeatureCard 
              icon={Shield} 
              title="Advanced Security" 
              desc="Keep your server safe with automated moderation, anti-spam heuristics, and intelligent raid prevention systems." 
            />
            <FeatureCard 
              icon={Cpu} 
              title="Deep Customization" 
              desc="Configure every aspect of the bot to match your server's unique operational needs and visual branding." 
            />
          </div>
        </div>
      </section>

      {/* Commands Preview */}
      <section id="commands" className="py-32 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight">Command Arsenal</h2>
            <p className="text-muted-foreground mt-4 text-lg">Explore a fraction of what RazeBot can do.</p>
          </div>
          
          {cmdsLoading ? (
            <div className="animate-pulse flex flex-col gap-4 max-w-5xl mx-auto">
               <div className="h-64 bg-card rounded-xl"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {commandCategories?.slice(0, 4).map((cat) => (
                <Card key={cat.category} className="p-8 bg-background/50 backdrop-blur-md border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Terminal size={24} />
                    </div>
                    <h3 className="text-2xl font-semibold capitalize">{cat.category}</h3>
                  </div>
                  <div className="space-y-6">
                    {cat.commands.slice(0, 3).map(cmd => (
                      <div key={cmd.name} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-accent bg-accent/10 px-2 py-1 rounded">/{cmd.name}</code>
                          {cmd.usage && <code className="text-xs font-mono text-muted-foreground">{cmd.usage}</code>}
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{cmd.description}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Announcements */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Announcements</h2>
              <p className="text-muted-foreground mt-2">Latest updates and operational status.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Live Feed
            </div>
          </div>
          
          <div className="space-y-6">
            {annLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-card/50 rounded-xl animate-pulse border border-border/50"></div>)}
              </div>
            ) : announcements?.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/20">
                <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">All systems nominal. No recent announcements.</p>
              </div>
            ) : (
              announcements?.map((ann) => (
                <Card key={ann.id} className="p-8 border-l-4 overflow-hidden relative bg-card/60 backdrop-blur-sm" style={{
                  borderLeftColor: ann.type === 'warning' ? 'var(--color-destructive)' : 
                                  ann.type === 'update' ? 'var(--color-primary)' : 
                                  ann.type === 'maintenance' ? '#eab308' : 'var(--color-accent)'
                }}>
                  <div className="flex items-start gap-6">
                    <div className={cn("mt-1 p-3 rounded-xl bg-background", 
                      ann.type === 'warning' ? 'text-destructive border border-destructive/20' : 
                      ann.type === 'update' ? 'text-primary border border-primary/20' : 
                      ann.type === 'maintenance' ? 'text-yellow-500 border border-yellow-500/20' : 'text-accent border border-accent/20'
                    )}>
                      {ann.type === 'warning' ? <AlertTriangle size={24} /> :
                       ann.type === 'update' ? <Activity size={24} /> :
                       ann.type === 'maintenance' ? <Wrench size={24} /> : <Info size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{ann.title}</h3>
                        <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border border-border">
                          {new Date(ann.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function StatBlock({ label, value, loading, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-0 group">
      <div className="mb-4 p-3 rounded-2xl bg-secondary/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
        <Icon size={28} />
      </div>
      <div className="text-4xl font-bold font-mono tracking-tight text-foreground">
        {loading ? <span className="text-muted-foreground opacity-50">...</span> : value?.toLocaleString() || '0'}
      </div>
      <div className="text-sm text-muted-foreground mt-2 uppercase tracking-widest font-medium">{label}</div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <Card className="p-8 bg-card/50 border-border/50 hover:border-primary/40 hover:bg-card transition-all duration-300 group">
      <div className="mb-8 inline-block p-4 rounded-2xl bg-background border border-border text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{desc}</p>
    </Card>
  )
}
