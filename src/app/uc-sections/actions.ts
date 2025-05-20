'use server';

import { db } from '@/app/db';
import { ucSections } from '@/app/db/schema/schema.uc';

export async function getUCSections() {
  try {
    const sections = await db.select().from(ucSections);
    return sections;
  } catch (error) {
    console.error('Error fetching UC sections:', error);
    throw new Error('Failed to fetch UC sections');
  }
} 