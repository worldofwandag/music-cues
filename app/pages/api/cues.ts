import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Music%20Cues`;

  try {
    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const data = await airtableRes.json();

    const cues = data.records.map((record: any) => ({
      id: record.id,
      title: record.fields.title || "",
      composer: record.fields.composer || "",
      genre: record.fields.genre || "",
      audio_url: record.fields.audio_url || "",
    }));

    res.status(200).json(cues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cues" });
  }
}

