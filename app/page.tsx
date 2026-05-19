import Link from "next/link";

const DEMO_BOT_ID = "cd9e4ffd-2d4a-42ff-b5f0-24eb165ae1e9";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">C</span>
            Chatfolio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="text-sm bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-700 transition">Get early access</Link>
          </div>
        </div>
      </nav>

      {/* Hero with soft gradient backdrop */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded-full px-3 py-1 mb-6">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Early access · Free during beta
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
              Your website,<br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">but it answers questions.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-6 leading-relaxed max-w-2xl">
              Drop one line of code into your site and visitors get an AI chatbot trained on your own content. Built for portfolios, creators, freelancers — anyone with a site that gets the same questions, over and over.
            </p>
            <div className="flex items-center gap-3 mt-10">
              <Link href="/signup" className="bg-emerald-600 text-white rounded-full px-6 py-3 font-medium hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20">Get early access</Link>
              <a href="#demo" className="text-gray-700 rounded-full px-6 py-3 font-medium hover:bg-gray-100 transition">Try the demo ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section id="demo" className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">See it in action.</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              The bubble in the bottom-right is a real Chatfolio widget, trained on this exact product. Click it and ask anything about Chatfolio.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Demo bot is live · Try: <em className="text-gray-700">&ldquo;How does Chatfolio work?&rdquo;</em>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 max-w-2xl">Set up in 3 minutes.</h2>
        <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">No technical setup. No complex configuration. Just paste content and embed.</p>
        <div className="grid md:grid-cols-3 gap-8 mt-14">
          <Step number="01" title="Create a bot" body="Give it a name and a system prompt. That's it — your bot exists." />
          <Step number="02" title="Add your content" body="Paste anything: bio, FAQs, project descriptions, resume. It gets chunked and embedded automatically." />
          <Step number="03" title="Embed anywhere" body="Copy one line of code, paste it on your site. Webflow, Squarespace, WordPress, plain HTML — works everywhere." />
        </div>
      </section>

      {/* Final CTA — dark with emerald gradient accent */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-gray-900 to-teal-900/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Stop answering the same questions.</h2>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto leading-relaxed">Free during early access. Set up takes 3 minutes. No credit card.</p>
          <Link href="/signup" className="inline-block bg-white text-gray-900 rounded-full px-6 py-3 font-medium mt-10 hover:bg-gray-100 transition shadow-lg shadow-emerald-900/30">Get early access</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Chatfolio</p>
          <p>Built by <a href="https://github.com/shubham7254" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 underline underline-offset-2">Shubham Jagtap</a></p>
        </div>
      </footer>

      <script src="/widget.js" data-bot-id={DEMO_BOT_ID} async />
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="group">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm font-mono font-semibold">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mt-5">{title}</h3>
      <p className="text-gray-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}