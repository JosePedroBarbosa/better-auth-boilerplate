import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password by entering your email address",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}