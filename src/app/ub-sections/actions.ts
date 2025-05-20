'use server';

import { db } from '@/app/db';
import { ubSections } from '@/app/db/schema/schema.ub';

export async function getUBSections() {
  try {
    const sections = await db.select().from(ubSections);
    return sections;
  } catch (error) {
    console.error('Error fetching UB sections:', error);
    throw new Error('Failed to fetch UB sections');
  }
} 