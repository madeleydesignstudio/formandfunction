import { Button } from "@ordo/ui/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>

      <Link
        href="https://docs.itsformfunction.com"
        className="text-blue-500 hover:underline"
      >
        Documentation
      </Link>
    </div>
  );
}
