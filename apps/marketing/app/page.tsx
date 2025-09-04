import { Button } from "@ordo/ui/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Form & Function
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Discover powerful tools and comprehensive documentation to get
            started.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Button asChild className="flex-1">
            <Link href="https://docs.itsformfunction.com">Documentation</Link>
          </Button>

          <Button asChild variant="outline" className="flex-1">
            <Link href="https://app.itsformfunction.com">Launch App</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
