import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user's bots
  const { data: bots } = await supabase
    .from("bots")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

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
          <h2 className="text-xl font-semibold text-gray-900">Your bots</h2>
        </div>

        {!bots || bots.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500 mb-4">You don&apos;t have any bots yet.</p>
            <p className="text-sm text-gray-400">
              Bot creation coming in the next feature. For now, auth works! 🎉
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {bots.map((bot) => (
              <li
                key={bot.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <p className="font-medium text-gray-900">{bot.name}</p>
                <p className="text-xs text-gray-500">{bot.id}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}