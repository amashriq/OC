import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch all schedule items
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("created_at", { ascending: false });

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

// POST - Create new schedule item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      event_type,
      description,
      date,
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
          event_type: event_type || null,
          description: description || null,
          date: date || null,
          start_time: start_time || null,
          end_time: end_time || null,
          day_of_week: day_of_week || null,
          is_recurring: is_recurring || false,
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

// PUT - Update existing schedule item
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      event_type,
      description,
      date,
      start_time,
      end_time,
      day_of_week,
      is_recurring,
    } = body;

    const { data, error } = await supabase
      .from("schedules")
      .update({
        title,
        event_type: event_type || null,
        description: description || null,
        date: date || null,
        start_time: start_time || null,
        end_time: end_time || null,
        day_of_week: day_of_week || null,
        is_recurring: is_recurring || false,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Schedule item not found" },
        { status: 404 }
      );
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

// DELETE - Delete schedule item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("schedules").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Schedule item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
