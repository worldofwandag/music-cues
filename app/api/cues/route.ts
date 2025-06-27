// app/api/cues/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Check for required environment variables
  const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;
  
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    console.error("Missing environment variables:", {
      AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
      AIRTABLE_API_KEY: !!AIRTABLE_API_KEY
    });
    
    return NextResponse.json(
      { error: "Server configuration error: Missing Airtable credentials" }, 
      { status: 500 }
    );
  }

  // Try the exact table name from your Airtable base
  // Common variations: "Music Cues", "Music%20Cues", "tblXXXXXXXXXXXXXX"
  const tableName = process.env.AIRTABLE_TABLE_NAME || "music%20data";
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;

  try {
    console.log("Fetching from Airtable:", url);
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: "no-store",
    });

    console.log("Airtable response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Airtable API error:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Airtable API error: ${res.status} ${res.statusText}`,
          details: errorText 
        }, 
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("Airtable response data:", data);

    // Validate response structure
    if (!data || !data.records || !Array.isArray(data.records)) {
      console.error("Invalid Airtable response structure:", data);
      return NextResponse.json(
        { error: "Invalid response from Airtable" }, 
        { status: 500 }
      );
    }

    const cues = data.records.map((record: any) => {
      if (!record.id || !record.fields) {
        console.warn("Invalid record structure:", record);
        return null;
      }
      
      return {
        id: record.id,
        title: record.fields.title || "",
        composer: record.fields.composer || "",
        // Handle Multiple Select field - convert array to comma-separated string
        genre: Array.isArray(record.fields.genre) 
          ? record.fields.genre.join(', ') 
          : typeof record.fields.genre === 'string' 
            ? record.fields.genre 
            : "",
        // Fix audio URL path and add extension if missing
        audio_url: record.fields.audio_url 
          ? (() => {
              let url = record.fields.audio_url;
              // Remove /public/ prefix if it exists
              url = url.replace('/public/', '/');
              // Remove trailing slash
              url = url.replace(/\/$/, '');
              
              // Add .mp3 extension if no extension exists (all files are now .mp3)
              if (!url.includes('.')) {
                url += '.mp3';
              }
              return url;
            })()
          : "",
      };
    }).filter(Boolean); // Remove null entries

    console.log("Processed cues:", cues.length);
    return NextResponse.json(cues);

  } catch (error) {
    console.error("API Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch cues", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}