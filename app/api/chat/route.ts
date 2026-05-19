import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { bot_id, question } = await req.json();

    if (!bot_id || !question) {
      return new Response(
        JSON.stringify({ error: "bot_id and question are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Embed the question
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    // 2. Retrieve top-k chunks
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
      return new Response(JSON.stringify({ error: matchError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const context =
      matches && matches.length > 0
        ? matches
            .map((m: any, i: number) => `[${i + 1}] ${m.content}`)
            .join("\n\n")
        : "No relevant information found.";

    const systemPrompt = `You are a helpful assistant answering questions based ONLY on the provided context.
If the answer is not in the context, say "I don't have that information" — do NOT make things up.
Keep answers concise and friendly.

Context:
${context}`;

    // 3. Stream the completion
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.3,
      stream: true,
    });

    // 4. Convert OpenAI's stream to a web ReadableStream of plain text tokens
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              controller.enqueue(encoder.encode(token));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}