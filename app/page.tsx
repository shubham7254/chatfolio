import Link from "next/link";

const DEMO_BOT_ID = "cd9e4ffd-2d4a-42ff-b5f0-24eb165ae1e9";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900">Chatfolio</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="text-sm bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-700 transition">Get early access</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium rounded-full px-3 py-1 mb-6">Early access · Free during beta</div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
            Your website,<br /><span className="text-gray-400">but it answers questions.</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed max-w-2xl">
            Drop one line of code into your site and visitors get an AI chatbot trained on your own content. Built for portfolios, creators, freelancers — anyone with a site that gets the same questions, over and over.
          </p>
          <div className="flex items-center gap-3 mt-10">
            <Link href="/signup" className="bg-gray-900 text-white rounded-full px-6 py-3 font-medium hover:bg-gray-700 transition">Get early access</Link>
            <a href="#demo" className="text-gray-700 rounded-full px-6 py-3 font-medium hover:bg-gray-100 transition">Try the demo ↓</a>
          </div>
        </div>
      </section>

      <section id="demo" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">See it in action.</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              The bubble in the bottom-right is a real Chatfolio widget, trained on this exact product. Click it and ask anything about Chatfolio.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Demo bot is live · Try: <em>&ldquo;How does Chatfolio work?&rdquo;</em>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 max-w-2xl">Set up in 3 minutes.</h2>
        <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">No technical setup. No complex configuration. Just paste content and embed.</p>
        <div className="grid md:grid-cols-3 gap-8 mt-14">
          <Step number="01" title="Create a bot" body="Give it a name and a system prompt. That's it — your bot exists." />
          <Step number="02" title="Add your content" body="Paste anything: bio, FAQs, project descriptions, resume. It gets chunked and embedded automatically." />
          <Step number="03" title="Embed anywhere" body="Copy one line of code, paste it on your site. Webflow, Squarespace, WordPress, plain HTML — works everywhere." />
        </div>
      </section>

      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Stop answering the same questions.</h2>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto leading-relaxed">Free during early access. Set up takes 3 minutes. No credit card.</p>
          <Link href="/signup" className="inline-block bg-white text-gray-900 rounded-full px-6 py-3 font-medium mt-10 hover:bg-gray-100 transition">Get early access</Link>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Chatfolio</p>
          <p>Built by <a href="https://github.com/shubham7254" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 underline underline-offset-2">Shubham Jagtap</a></p>
        </div>
      </footer>

      <script src="/widget.js" data-bot-id={DEMO_BOT_ID} async />
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div>
      <div className="text-sm font-mono text-gray-400">{number}</div>
      <h3 className="text-lg font-semibold text-gray-900 mt-3">{title}</h3>
      <p className="text-gray-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
