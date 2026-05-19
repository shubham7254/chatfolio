import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple chunker: splits text into ~1000-char chunks with 200-char overlap.
// Good enough for v1. We'll improve later.
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
    const { bot_id, text } = await req.json();

    if (!bot_id || !text) {
      return NextResponse.json(
        { error: "bot_id and text are required" },
        { status: 400 }
      );
    }

    const chunks = chunkText(text);

    // Embed all chunks in one API call (OpenAI supports batches)
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    });

    // Prepare rows for insertion
    const rows = chunks.map((content, i) => ({
      bot_id,
      content,
      embedding: embeddingResponse.data[i].embedding,
    }));

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