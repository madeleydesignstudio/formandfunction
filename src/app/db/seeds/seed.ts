import { seedUBSections } from './seed-ub-sections';
import { seedUCSections } from './seed-uc-sections';

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // Seed UB sections
    console.log('\nSeeding UB sections...');
    await seedUBSections();
    
    // Seed UC sections
    console.log('\nSeeding UC sections...');
    await seedUCSections();
    
    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

main(); 