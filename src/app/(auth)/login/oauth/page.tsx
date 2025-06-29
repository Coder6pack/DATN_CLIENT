import { Suspense } from "react";
import OAuthCallback from "./oauth-callback";

export default function OAuthPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
