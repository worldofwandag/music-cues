// app/api/cues/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Music%20Cues`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    const cues = data.records.map((record: any) => ({
      id: record.id,
      title: record.fields.title || "",
      composer: record.fields.composer || "",
      genre: record.fields.genre || "",
      audio_url: record.fields.audio_url || "",
    }));

    return NextResponse.json(cues);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch cues" }, { status: 500 });
  }
}
