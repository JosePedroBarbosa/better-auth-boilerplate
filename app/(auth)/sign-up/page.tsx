import { SignUpForm } from "./_components/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Get Started",
  description: "Create your account and join thousands of users",
};

export default function SignUpPage() {
  return <SignUpForm />;
}