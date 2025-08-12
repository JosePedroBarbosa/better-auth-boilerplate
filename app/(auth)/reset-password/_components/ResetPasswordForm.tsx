"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { SubmitButton } from "@/components/form/submit-button";
import { PasswordInput } from "@/components/form/password-input";
import { FormHeader } from "@/components/form/form-header";
import { FormFooterLink } from "@/components/form/form-footer-link";
import { authClient } from "@/lib/auth-client";

import { resetPasswordSchema, ResetPasswordSchemaType } from "@/lib/schemas";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      router.replace("/forgot-password");
      return;
    }

    setToken(tokenParam);
  }, [searchParams, router]);

  const onSubmit = (values: ResetPasswordSchemaType) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await authClient.resetPassword({
          newPassword: values.password,
          token,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Password reset successfully!");
        
        setTimeout(() => {
          router.push("/sign-in?message=password-reset");
        }, 1000);
        
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Reset password error:", error);
      }
    });
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-6 text-center">
          <FormHeader
            title="Invalid Reset Link"
            description="This password reset link is invalid or has expired"
          />
          <FormFooterLink
            question="Need a new reset link?"
            linkText="Request New Link"
            href="/forgot-password"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormHeader
          title="Reset Password"
          description="Enter your new password below"
        />

        <div className="space-y-2">
          <PasswordInput
            id="password"
            label="New Password"
            placeholder="********"
            register={register("password")}
            error={errors.password?.message}
            disabled={isPending}
          />

          <p className="text-xs text-muted-foreground">
            At least 8 characters, one uppercase letter, one number, one special character
          </p>
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="********"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isPending}
        />

        <SubmitButton isLoading={isPending}>
          {isPending ? "Resetting Password..." : "Reset Password"}
        </SubmitButton>

        <FormFooterLink
          question="Remember your password?"
          linkText="Sign In"
          href="/sign-in"
        />
      </form>
    </div>
  );
}