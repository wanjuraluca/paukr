import { Suspense } from "react";
import { noindexMetadata } from "@/lib/seo";
import AuthClient from "./AuthClient";

export const metadata = noindexMetadata("Anmelden | paukr");

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthClient />
    </Suspense>
  );
}
