"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearContentButton({ botId }: { botId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClear() {
    if (
      !confirm(
        "Clear all content for this bot? This cannot be undone. The bot will keep existing but won't know anything until you add new content."
      )
    )
      return;

    setLoading(true);
    const res = await fetch(`/api/bots/${botId}/documents`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to clear content");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleClear}
      disabled={loading}
      className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
    >
      {loading ? "Clearing..." : "Clear all content"}
    </button>
  );
}