import { Suspense } from "react";
import RegisterForm from "./register-form";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
