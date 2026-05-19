import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const { data: bot } = await supabase
      .from("bots")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found or access denied" },
        { status: 404 }
      );
    }

    // Clear all documents for this bot (admin client bypasses RLS)
    const { error } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("bot_id", id);

    if (error) {
      console.error("Clear documents error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Clear content error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}