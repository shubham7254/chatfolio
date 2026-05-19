import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { bot_id, question } = await req.json();

    if (!bot_id || !question) {
      return NextResponse.json(
        { error: "bot_id and question are required" },
        { status: 400 }
      );
    }

    // 1. Embed the question
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    // 2. Find the most relevant chunks via the RPC we created in Supabase
    const { data: matches, error: matchError } = await supabaseAdmin.rpc(
      "match_documents",
      {
        query_embedding: queryEmbedding,
        match_bot_id: bot_id,
        match_count: 5,
      }
    );

    if (matchError) {
      console.error("Match error:", matchError);
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    // 3. Build context from retrieved chunks
    const context =
      matches && matches.length > 0
        ? matches.map((m: any, i: number) => `[${i + 1}] ${m.content}`).join("\n\n")
        : "No relevant information found.";

    // 4. Ask the LLM to answer using only the context
    const systemPrompt = `You are a helpful assistant answering questions based ONLY on the provided context.
If the answer is not in the context, say "I don't have that information" — do NOT make things up.
Keep answers concise and friendly.

Context:
${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.3,
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({
      answer,
      sources: matches?.length ?? 0,
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}