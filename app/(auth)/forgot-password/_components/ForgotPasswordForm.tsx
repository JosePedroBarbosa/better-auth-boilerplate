"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SubmitButton } from "@/components/form/submit-button";
import { FormHeader } from "@/components/form/form-header";
import { FormFooterLink } from "@/components/form/form-footer-link";

import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/lib/schemas";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordSchemaType) => {
    startTransition(async () => {
      try {
        const { error } = await authClient.forgetPassword({
          email: values.email,
          redirectTo: "/reset-password",
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        setSentEmail(values.email);
        setEmailSent(true);
        toast.success("Password reset email sent successfully.");
        reset();
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Forgot password error:", error);
      }
    });
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    setSentEmail("");
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <FormHeader
            title="Check Your Email"
            description="We've sent a password reset link to your email"
          />

          <div className="text-center space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex justify-center">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-green-800 dark:text-green-200">
                Email sent to {sentEmail}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToForm}
              className="w-full h-11 border-2 transition-all duration-200 cursor-pointer mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Different Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormHeader
          title="Forgot Password"
          description="Enter your email to reset your password"
        />

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isPending}
              {...register("email")}
              className={cn(
                errors.email && "border-red-500 focus:border-red-500"
              )}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-600 text-sm" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <SubmitButton isLoading={isPending}>Send Reset Link</SubmitButton>
        </div>

        <FormFooterLink
          question="Remembered your password?"
          linkText="Sign In"
          href="/sign-in"
        />
      </form>
    </div>
  );
}