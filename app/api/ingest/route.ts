import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bot_id, text } = await req.json();

    if (!bot_id || !text) {
      return NextResponse.json(
        { error: "bot_id and text are required" },
        { status: 400 }
      );
    }

    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "text must be a non-empty string" },
        { status: 400 }
      );
    }

    // Verify the user owns this bot
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .select("id")
      .eq("id", bot_id)
      .eq("owner_id", user.id)
      .single();

    if (botError || !bot) {
      return NextResponse.json(
        { error: "Bot not found or access denied" },
        { status: 404 }
      );
    }

    const chunks = chunkText(text);

    // Embed all chunks
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    });

    const rows = chunks.map((content, i) => ({
      bot_id,
      content,
      embedding: embeddingResponse.data[i].embedding,
    }));

    // Use admin client to insert (bypasses RLS so we don't need to worry about cookie context)
    // We've already done the ownership check above, so this is safe.
    const { error } = await supabaseAdmin.from("documents").insert(rows);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      chunks_inserted: chunks.length,
    });
  } catch (err: any) {
    console.error("Ingest error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}