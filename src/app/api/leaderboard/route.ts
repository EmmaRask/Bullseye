import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}