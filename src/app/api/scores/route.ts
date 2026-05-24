import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_SCORE = 500;

export async function GET() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const player_name = body.player_name?.trim();
    const score = body.score;
    const transaction_id = body.transaction_id;

    if (
      typeof player_name !== "string" ||
      typeof score !== "number" ||
      typeof transaction_id !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (score < 0 || score > MAX_SCORE) {
      return NextResponse.json(
        { error: "Invalid score" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("scores")
      .insert([
        {
          player_name,
          score,
          transaction_id,
        },
      ]);

    if (error) {
      console.error(error);

      // duplicate transaction_id
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Score already submitted" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}