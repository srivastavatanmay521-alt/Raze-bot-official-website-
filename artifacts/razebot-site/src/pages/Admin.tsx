import { useState, useEffect } from "react"
import { Button, Card, Input, cn } from "@/components/ui/shared"
import {
  useAdminLogin,
  useGetAdminStats,
  getGetAdminStatsQueryKey,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useGetAnnouncements,
  getGetAnnouncementsQueryKey,
  useUpdateStatsOverride,
  useCreatePartner,
  useDeletePartner,
  useGetPartners,
  getGetPartnersQueryKey,
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Shield, Trash2, Activity, Save, Radio, LayoutDashboard, Handshake, Megaphone } from "lucide-react"

type AdminTab = "announcements" | "partners" | "stats"

export function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("razebot_admin_token"))

  if (!token) {
    return <AdminLoginForm onLogin={(t) => {
      localStorage.setItem("razebot_admin_token", t)
      setToken(t)
    }} />
  }

  return <AdminDashboard token={token} onLogout={() => {
    localStorage.removeItem("razebot_admin_token")
    setToken(null)
  }} />
}

function AdminLoginForm({ onLogin }: { onLogin: (t: string) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const login = useAdminLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    login.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        if (data.success && data.token) {
          onLogin(data.token)
        } else {
          setError("Invalid credentials")
        }
      },
      onError: () => {
        setError("Authentication failed. Check your credentials.")
      }
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-10 border-primary/30 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(108,99,255,0.2)]">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Override</h1>
          <p className="text-sm text-muted-foreground mt-3 font-mono">SYSTEM CLEARANCE REQUIRED</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email</label>
            <Input
              type="email"
              placeholder="admin@razebot.site"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 bg-background border-border/50 focus-visible:ring-primary"
              data-testid="input-admin-email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Password</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-12 bg-background border-border/50 focus-visible:ring-primary"
              data-testid="input-admin-password"
            />
          </div>
          {error && <p className="text-sm text-destructive text-center font-medium bg-destructive/10 py-2 rounded-md">{error}</p>}
          <Button
            type="submit"
            className="w-full h-12 text-base mt-2"
            variant="gradient"
            disabled={login.isPending || !email || !password}
            data-testid="button-admin-login"
          >
            {login.isPending ? "Authenticating..." : "Authorize Access"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

function AdminDashboard({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("announcements")

  const { data: stats, error: statsError } = useGetAdminStats({
    query: {
      refetchInterval: 5000,
      queryKey: getGetAdminStatsQueryKey(),
      retry: false,
    },
    request: {
      headers: { Authorization: `Bearer ${token}` }
    }
  })

  useEffect(() => {
    if (statsError) onLogout()
  }, [statsError, onLogout])

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "announcements", label: "Announcements", icon: <Megaphone size={16} /> },
    { id: "partners", label: "Partners", icon: <Handshake size={16} /> },
    { id: "stats", label: "Stats Override", icon: <Activity size={16} /> },
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 bg-card/40 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/10 text-primary rounded-xl hidden sm:block">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                LIVE
              </div>
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-sm">Real-time telemetry and operational controls.</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
          Disconnect Session
        </Button>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard label="Servers" value={stats?.servers} />
        <StatCard label="Users" value={stats?.users} />
        <StatCard label="Commands" value={stats?.commandsRun} />
        <StatCard label="Partners" value={stats?.partners} />
        <StatCard label="Announcements" value={stats?.announcements} />
        <StatCard label="Uptime" value={stats?.uptime} isText className="col-span-2 md:col-span-1" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-card/40 border border-border/50 rounded-xl mb-8 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === tab.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            data-testid={`tab-admin-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "announcements" && <AnnouncementsPanel token={token} />}
      {activeTab === "partners" && <PartnersPanel token={token} />}
      {activeTab === "stats" && <StatsOverridePanel token={token} stats={stats} />}
    </div>
  )
}

function StatCard({ label, value, isText, className }: { label: string; value?: string | number; isText?: boolean; className?: string }) {
  return (
    <Card className={cn("p-5 flex flex-col justify-between bg-card/40 border-border/50 backdrop-blur-sm", className)}>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{label}</span>
      <span className={cn("tracking-tight", isText ? "text-xl font-semibold text-foreground" : "text-3xl font-extrabold font-mono text-primary")}>
        {value !== undefined ? (isText ? value : typeof value === "number" ? value.toLocaleString() : value) : "—"}
      </span>
    </Card>
  )
}

function AnnouncementsPanel({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const { data: announcements } = useGetAnnouncements()
  const createAnn = useCreateAnnouncement({ request: { headers: { Authorization: `Bearer ${token}` } } })
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<"info" | "warning" | "update" | "maintenance">("info")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) { setError("Title and content are required"); return }
    setError("")
    createAnn.mutate({ data: { title, content, type } }, {
      onSuccess: () => {
        setTitle(""); setContent(""); setType("info")
        queryClient.invalidateQueries({ queryKey: getGetAnnouncementsQueryKey() })
      },
      onError: () => setError("Failed to create announcement")
    })
  }

  return (
    <div className="grid xl:grid-cols-5 gap-8">
      {/* Create Form */}
      <Card className="xl:col-span-2 p-8 bg-card/40 border-border/50 h-fit">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Radio size={20} className="text-primary" />
          New Broadcast
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive bg-destructive/10 py-2 px-3 rounded-md">{error}</p>}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. System Update v2.4" className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Classification</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="info">Information</option>
              <option value="update">Update</option>
              <option value="warning">Warning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              placeholder="Broadcast message..."
            />
          </div>
          <Button type="submit" variant="gradient" className="w-full" disabled={createAnn.isPending}>
            {createAnn.isPending ? "Transmitting..." : "Execute Broadcast"}
          </Button>
        </form>
      </Card>

      {/* List */}
      <Card className="xl:col-span-3 p-8 bg-card/40 border-border/50">
        <h2 className="text-xl font-bold mb-6">Active Broadcasts</h2>
        <div className="space-y-3">
          {!announcements?.length ? (
            <div className="py-12 text-center border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-sm">No broadcasts yet.</p>
            </div>
          ) : announcements.map(ann => (
            <div key={ann.id} className="flex items-start justify-between p-4 rounded-xl bg-background border border-border/50 hover:border-border transition-colors gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0",
                    ann.type === 'info' ? "bg-accent/10 text-accent" :
                      ann.type === 'warning' ? "bg-destructive/10 text-destructive" :
                        ann.type === 'update' ? "bg-primary/10 text-primary" :
                          "bg-yellow-500/10 text-yellow-500"
                  )}>{ann.type}</span>
                  <h3 className="font-semibold text-foreground truncate">{ann.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                <p className="text-xs font-mono text-muted-foreground/50 mt-1">ID:{ann.id} · {new Date(ann.createdAt).toLocaleString()}</p>
              </div>
              <DeleteButton onDelete={() => {}} id={ann.id} token={token} type="announcement" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PartnersPanel({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const { data: partners } = useGetPartners()
  const createPartner = useCreatePartner({ request: { headers: { Authorization: `Bearer ${token}` } } })
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [inviteUrl, setInviteUrl] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [memberCount, setMemberCount] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || !inviteUrl) { setError("Name, description, and invite URL are required"); return }
    setError("")
    createPartner.mutate({
      data: {
        name,
        description,
        inviteUrl,
        iconUrl: iconUrl || null,
        memberCount: memberCount || null,
      }
    }, {
      onSuccess: () => {
        setName(""); setDescription(""); setInviteUrl(""); setIconUrl(""); setMemberCount("")
        queryClient.invalidateQueries({ queryKey: getGetPartnersQueryKey() })
      },
      onError: () => setError("Failed to add partner")
    })
  }

  return (
    <div className="grid xl:grid-cols-5 gap-8">
      {/* Create Form */}
      <Card className="xl:col-span-2 p-8 bg-card/40 border-border/50 h-fit">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Handshake size={20} className="text-accent" />
          Add Partner
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive bg-destructive/10 py-2 px-3 rounded-md">{error}</p>}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Server Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Awesome Server" className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              placeholder="What makes this server special..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Invite URL</label>
            <Input value={inviteUrl} onChange={e => setInviteUrl(e.target.value)} placeholder="https://discord.gg/..." className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Icon URL <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span></label>
            <Input value={iconUrl} onChange={e => setIconUrl(e.target.value)} placeholder="https://..." className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Member Count <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span></label>
            <Input value={memberCount} onChange={e => setMemberCount(e.target.value)} placeholder="e.g. 5,000+" className="bg-background" />
          </div>
          <Button type="submit" variant="gradient" className="w-full" disabled={createPartner.isPending}>
            {createPartner.isPending ? "Adding..." : "Add Partner"}
          </Button>
        </form>
      </Card>

      {/* List */}
      <Card className="xl:col-span-3 p-8 bg-card/40 border-border/50">
        <h2 className="text-xl font-bold mb-6">Current Partners</h2>
        <div className="space-y-3">
          {!partners?.length ? (
            <div className="py-12 text-center border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-sm">No partners added yet.</p>
            </div>
          ) : partners.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50 hover:border-border transition-colors gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.iconUrl ? (
                    <img src={p.iconUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-primary">{p.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.inviteUrl}</p>
                </div>
              </div>
              <DeleteButton onDelete={() => {}} id={p.id} token={token} type="partner" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DeleteButton({ id, token, type }: { onDelete: () => void; id: number; token: string; type: "announcement" | "partner" }) {
  const queryClient = useQueryClient()
  const delAnn = useDeleteAnnouncement({ request: { headers: { Authorization: `Bearer ${token}` } } })
  const delPartner = useDeletePartner({ request: { headers: { Authorization: `Bearer ${token}` } } })

  const isPending = type === "announcement" ? delAnn.isPending : delPartner.isPending

  const handleDelete = () => {
    if (!confirm(`Delete this ${type}? This cannot be undone.`)) return
    if (type === "announcement") {
      delAnn.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAnnouncementsQueryKey() })
      })
    } else {
      delPartner.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetPartnersQueryKey() })
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 disabled:opacity-50"
      data-testid={`button-delete-${type}-${id}`}
    >
      <Trash2 size={16} />
    </button>
  )
}

function StatsOverridePanel({ token, stats }: { token: string; stats: any }) {
  const queryClient = useQueryClient()
  const override = useUpdateStatsOverride({ request: { headers: { Authorization: `Bearer ${token}` } } })
  const [servers, setServers] = useState("")
  const [users, setUsers] = useState("")
  const [cmds, setCmds] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    override.mutate({
      data: {
        servers: servers ? parseInt(servers) : null,
        users: users ? parseInt(users) : null,
        commandsRun: cmds ? parseInt(cmds) : null,
      }
    }, {
      onSuccess: () => {
        setServers(""); setUsers(""); setCmds("")
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() })
      }
    })
  }

  return (
    <div className="max-w-xl">
      <Card className="p-8 bg-card/40 border-border/50">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
          <Activity size={20} className="text-accent" />
          Manual Stats Override
        </h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Inject values into the public telemetry feed. Leave blank to restore live data.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Servers</label>
            <Input type="number" value={servers} onChange={e => setServers(e.target.value)} placeholder={stats?.servers?.toString() ?? "Current value"} className="bg-background font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Users</label>
            <Input type="number" value={users} onChange={e => setUsers(e.target.value)} placeholder={stats?.users?.toString() ?? "Current value"} className="bg-background font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Commands Run</label>
            <Input type="number" value={cmds} onChange={e => setCmds(e.target.value)} placeholder={stats?.commandsRun?.toString() ?? "Current value"} className="bg-background font-mono" />
          </div>
          <Button type="submit" variant="outline" className="w-full border-border/80 hover:bg-accent/10 hover:text-accent hover:border-accent/30" disabled={override.isPending}>
            <Save size={16} className="mr-2" />
            Apply Override
          </Button>
        </form>
      </Card>
    </div>
  )
}
