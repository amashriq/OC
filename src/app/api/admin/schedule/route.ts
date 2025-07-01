import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      start_time,
      end_time,
      day_of_week,
      is_recurring,
    } = body;

    // Insert into Supabase
    const { data, error } = await supabase
      .from("schedules")
      .insert([
        {
          title,
          description,
          start_time: start_time || null,
          end_time: end_time || null,
          day_of_week: day_of_week || null,
          is_recurring,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
