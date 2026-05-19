import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import EmbedChat from "./embed-chat";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const { botId } = await params;

  const { data: bot } = await supabaseAdmin
    .from("bots")
    .select("id, name")
    .eq("id", botId)
    .single();

  if (!bot) notFound();

  return <EmbedChat botId={bot.id} botName={bot.name} />;
}