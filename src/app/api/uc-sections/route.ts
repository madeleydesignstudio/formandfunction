import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const sections = await sql`
      SELECT * FROM uc_sections
      ORDER BY section ASC;
    `;
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching UC sections:', error);
    return NextResponse.json({ error: 'Failed to load UC sections' }, { status: 500 });
  }
} 