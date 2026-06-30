import { DocumentsPage } from "@/features/documents/pages/DocumentsPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading documents...</div>}>
      <DocumentsPage />
    </Suspense>
  );
}
