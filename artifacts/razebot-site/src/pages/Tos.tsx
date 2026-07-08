export function Tos() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl min-h-[80vh]">
      <div className="mb-16 border-b border-border/50 pb-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground text-lg font-mono">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-accent prose-li:text-muted-foreground">
        <p className="text-xl text-foreground mb-12 leading-relaxed">
          Welcome to RazeBot. By adding our bot to your Discord server or using our website, you agree to these Terms of Service. Please read them carefully.
        </p>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">01.</span>
            Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing and using RazeBot ("the Bot") and its associated website (razebot.site), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">02.</span>
            Bot Usage
          </h2>
          <p className="leading-relaxed">
            RazeBot is provided "as is" and is intended to enhance your Discord experience. We reserve the right to modify, suspend, or discontinue any feature of the Bot at any time without notice. You are responsible for ensuring that your use of the Bot complies with Discord's Terms of Service and Community Guidelines.
          </p>
        </section>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">03.</span>
            Prohibited Activities
          </h2>
          <ul className="list-disc pl-6 space-y-3 mt-4">
            <li>Using the Bot to distribute malicious content, spam, or participate in illegal activities.</li>
            <li>Attempting to reverse engineer, decompile, or exploit the Bot's infrastructure.</li>
            <li>Using the Bot to bypass Discord's safety or moderation features.</li>
            <li>Automating Bot commands through unauthorized scripts or macros.</li>
          </ul>
        </section>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">04.</span>
            Data & Privacy
          </h2>
          <p className="leading-relaxed">
            We value your privacy. The Bot only collects data necessary for its core functions (such as server IDs, user IDs for moderation logs, and command usage statistics). We do not store message content unless explicitly required for a feature you have enabled (like moderation logging), and we never sell your data to third parties.
          </p>
        </section>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">05.</span>
            Service Changes
          </h2>
          <p className="leading-relaxed">
            We continually update our services to provide the best experience. As a result, we may make changes to these terms. Continued use of the Bot after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-12 bg-card/30 p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-primary font-mono text-xl">06.</span>
            Contact
          </h2>
          <p className="leading-relaxed">
            If you have any questions about these Terms, please contact our support team in the official RazeBot Discord server or email us at legal@razebot.site.
          </p>
        </section>
      </div>
    </div>
  )
}
