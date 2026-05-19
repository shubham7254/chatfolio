"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContentForm({ botId }: { botId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!text.trim()) return;

    setLoading(true);
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bot_id: botId, text }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to add content");
      setLoading(false);
      return;
    }

    setSuccess(`Added ${data.chunks_inserted} chunk(s).`);
    setText("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your content here — bio, FAQs, resume, anything you want the bot to know..."
        rows={8}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-blue-600 text-white rounded-xl px-5 py-2.5 font-medium hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          {loading ? "Adding..." : "Add to bot"}
        </button>
      </div>
    </form>
  );
}