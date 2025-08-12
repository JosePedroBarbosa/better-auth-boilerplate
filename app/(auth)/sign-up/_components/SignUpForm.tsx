"use client";

import React, { useTransition, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { generateUniqueUsername } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, SignUpSchemaType } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/form/password-input";
import { FormHeader } from "@/components/form/form-header";
import { FormFooterLink } from "@/components/form/form-footer-link";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background" />
);

export function SignUpForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const isAnyLoading = useMemo(() => isPending, [isPending]);

  const onSubmit = useCallback((data: SignUpSchemaType) => {
    startTransition(async () => {
      try {
        const uniqueUsername = generateUniqueUsername();

        const { error } = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: uniqueUsername,
        });

        if (error) {
          const message = error.message || "Failed to create account";

          if (message.toLowerCase().includes("email")) {
            setError("email", { message });
          } else {
            toast.error(message);
          }

          return;
        }

        toast.success("Account created successfully!");
        reset();
        router.replace("/onboarding");
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error("An unexpected error occurred");
      }
    });
  }, [reset, router, setError]);

  return (
    <div className="space-y-6">
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        {...props}
      >
        <FormHeader title="Get Started" description="Create a new account" />

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isAnyLoading}
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

          <div className="grid gap-3">
            <PasswordInput
              id="password"
              label="Password"
              placeholder="********"
              register={register("password")}
              error={errors.password?.message}
              disabled={isAnyLoading}
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters, one uppercase letter, one number, one special
              character
            </p>
          </div>

          <div className="grid gap-3">
            <PasswordInput
              id="confirm-password"
              label="Confirm Password"
              placeholder="********"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              disabled={isAnyLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 border-2 transition-all duration-200 cursor-pointer"
            disabled={isAnyLoading || !isValid}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>

        <FormFooterLink
          question="Already have an account?"
          linkText="Sign In Now"
          href="/sign-in"
        />
      </form>
    </div>
  );
}
