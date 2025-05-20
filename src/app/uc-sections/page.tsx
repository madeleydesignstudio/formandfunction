import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { UCSectionsTable } from './uc-sections-table';
import { getUCSections } from './actions';

// This is now a server component
export default async function UCSectionsPage() {
  const sections = await getUCSections();

  return (
    <div className="mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">UC Sections</h1>
      <Suspense fallback={<TableSkeleton />}>
        <UCSectionsTable sections={sections} />
      </Suspense>
    </div>
  );
}

// Skeleton component for loading state
function TableSkeleton() {
  return (
    <div className="rounded-md border overflow-x-auto">
      <div className="p-4">
        <Skeleton className="h-10 w-[200px] mb-4" />
      </div>
      <div className="p-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex gap-4 mb-4">
            {Array.from({ length: 10 }).map((_, cellIndex) => (
              <Skeleton key={cellIndex} className="h-4 w-[100px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 