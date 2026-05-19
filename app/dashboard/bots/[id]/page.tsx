import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ContentForm from "./content-form";
import ClearContentButton from "./clear-content-button";

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: bot } = await supabase
    .from("bots")
    .select("id, name, system_prompt, created_at")
    .eq("id", id)
    .single();

  if (!bot) notFound();

  // Fetch document chunks for preview
  const { data: documents, count } = await supabase
    .from("documents")
    .select("id, content", { count: "exact" })
    .eq("bot_id", id)
    .order("id", { ascending: false })
    .limit(20);

  const totalChunks = count ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 mt-1">
              {bot.name}
            </h1>
          </div>
          <Link
            href={`/chat/${bot.id}`}
            target="_blank"
            className="text-sm bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700"
          >
            Test chat ↗
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* System prompt */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-2">System prompt</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {bot.system_prompt}
          </p>
        </section>
        
        {/* Embed snippet */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Embed on your site</h2>
          <p className="text-sm text-gray-500 mb-4">
            Paste this snippet into the HTML of any page you want the chat to appear on.
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 overflow-x-auto">
            {`<script src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/widget.js" data-bot-id="${bot.id}"></script>`}
          </pre>
        </section>

        {/* Add content */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Add content</h2>
          <p className="text-sm text-gray-500 mb-4">
            Paste any text you want this bot to know about. It will be chunked
            and embedded automatically.
          </p>
          <ContentForm botId={bot.id} />
        </section>

        {/* Existing content */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Indexed content</h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalChunks === 0
                  ? "No content yet."
                  : `${totalChunks} chunk${totalChunks === 1 ? "" : "s"} indexed${totalChunks > 20 ? " (showing latest 20)" : ""}`}
              </p>
            </div>
            {totalChunks > 0 && <ClearContentButton botId={bot.id} />}
          </div>

          {totalChunks === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              Add some content above to get started.
            </div>
          ) : (
            <ul className="space-y-2">
              {documents!.map((doc) => (
                <li
                  key={doc.id}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700"
                >
                  {doc.content.slice(0, 150)}
                  {doc.content.length > 150 ? "…" : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}