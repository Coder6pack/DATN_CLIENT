import { Suspense } from "react";
import ForgotPasswordForm from "./forgot-password-form";
export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
