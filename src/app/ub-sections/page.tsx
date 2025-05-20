import { Suspense } from 'react';
import { UBSectionsTable } from './ub-sections-table';
import { getUBSections } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[250px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-[400px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function UBSectionsPage() {
  const sections = await getUBSections();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">UB Sections</h1>
      <Suspense fallback={<TableSkeleton />}>
        <UBSectionsTable sections={sections} />
      </Suspense>
    </div>
  );
} 