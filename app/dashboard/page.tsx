import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";
import CreateBotDialog from "./create-bot-dialog";
import DeleteBotButton from "./delete-bot-button";

const FREE_TIER_BOT_LIMIT = 1;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: bots } = await supabase
    .from("bots")
    .select("id, name, system_prompt, created_at")
    .order("created_at", { ascending: false });

  const botCount = bots?.length ?? 0;
  const atLimit = botCount >= FREE_TIER_BOT_LIMIT;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your bots</h2>
            <p className="text-sm text-gray-500 mt-1">
              {botCount} / {FREE_TIER_BOT_LIMIT} used on free tier
            </p>
          </div>
          <CreateBotDialog
            disabled={atLimit}
            disabledReason="Free tier limit reached. Delete a bot to create a new one."
          />
        </div>

        {botCount === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500 mb-2">You don&apos;t have any bots yet.</p>
            <p className="text-sm text-gray-400">
              Click <strong>+ New bot</strong> to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {bots!.map((bot) => (
              <li
                key={bot.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-gray-300 transition"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/bots/${bot.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                  >
                    {bot.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                    {bot.id}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <Link
                    href={`/chat/${bot.id}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Test chat ↗
                  </Link>
                  <DeleteBotButton botId={bot.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}