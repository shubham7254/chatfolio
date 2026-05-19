import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

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

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">System prompt</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {bot.system_prompt}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-500 mb-2">No content yet.</p>
          <p className="text-sm text-gray-400">
            Content ingestion coming in the next feature.
          </p>
        </div>
      </main>
    </div>
  );
}