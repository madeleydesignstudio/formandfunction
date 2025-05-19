import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { ubSections } from '@/app/db/schema/schema.ub';

export async function GET() {
  try {
    const sections = await db.select().from(ubSections);
    console.log('API Response - Number of sections:', sections.length);
    console.log('API Response - First section:', sections[0]);
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching UB sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UB sections' },
      { status: 500 }
    );
  }
} 