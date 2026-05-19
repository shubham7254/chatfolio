import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ChatClient from "./chat-client";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const { botId } = await params;

  // Verify bot exists (using admin client since this is a public page,
  // no logged-in user context required)
  const { data: bot } = await supabaseAdmin
    .from("bots")
    .select("id, name")
    .eq("id", botId)
    .single();

  if (!bot) notFound();

  return <ChatClient botId={bot.id} botName={bot.name} />;
}