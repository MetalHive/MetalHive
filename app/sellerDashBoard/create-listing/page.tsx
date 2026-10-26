import { Suspense } from "react";
import CreateListing from "./CreateListing";

// CreateListing reads `?draft=<id>` via useSearchParams, which needs a
// Suspense boundary for static prerendering.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateListing />
    </Suspense>
  );
}
