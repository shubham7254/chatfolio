import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FREE_TIER_BOT_LIMIT = 1;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, system_prompt } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Bot name is required" },
        { status: 400 }
      );
    }

    if (name.length > 60) {
      return NextResponse.json(
        { error: "Bot name must be 60 characters or fewer" },
        { status: 400 }
      );
    }

    // Free-tier limit: count user's existing bots
    const { count, error: countError } = await supabase
      .from("bots")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id);

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count ?? 0) >= FREE_TIER_BOT_LIMIT) {
      return NextResponse.json(
        {
          error: `Free tier is limited to ${FREE_TIER_BOT_LIMIT} bot. Delete an existing bot or upgrade to create more.`,
        },
        { status: 403 }
      );
    }

    // Insert the bot
    const { data: bot, error: insertError } = await supabase
      .from("bots")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        system_prompt: system_prompt?.trim() || "You are a helpful assistant.",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ bot });
  } catch (err: any) {
    console.error("Create bot error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}