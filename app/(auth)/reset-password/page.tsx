import { ResetPasswordForm } from "./_components/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}