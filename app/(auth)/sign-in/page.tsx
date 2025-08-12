import { SignInForm } from "./_components/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Welcome Back",
  description: "Sign in to your account to access your dashboard",
};

export default function SignInPage() {
  return <SignInForm />;
}