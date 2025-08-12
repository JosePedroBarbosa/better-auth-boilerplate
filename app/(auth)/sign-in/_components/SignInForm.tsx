"use client";

// React & Next.js
import React, { useTransition, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Form handling
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI & Icons
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";

// Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/form/password-input";
import { FormHeader } from "@/components/form/form-header";
import { FormFooterLink } from "@/components/form/form-footer-link";

// Auth & Schemas
import { authClient } from "@/lib/auth-client";
import { signInSchema, SignInSchemaType } from "@/lib/schemas";

// Constants
const TOTP_CODE_LENGTH = 6;

interface TwoFAState {
  isActive: boolean;
  code: string;
  isVerifying: boolean;
}

interface SignInFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [twoFAState, setTwoFAState] = useState<TwoFAState>({
    isActive: false,
    code: "",
    isVerifying: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const reset2FAState = useCallback(() => {
    setTwoFAState({
      isActive: false,
      code: "",
      isVerifying: false,
    });
  }, []);

  const updateTwoFACode = useCallback((code: string) => {
    const numericCode = code.replace(/\D/g, "").slice(0, TOTP_CODE_LENGTH);
    setTwoFAState(prev => ({ ...prev, code: numericCode }));
  }, []);

  const handle2FAVerification = useCallback(() => {
    if (!twoFAState.code.trim() || twoFAState.code.length !== TOTP_CODE_LENGTH) {
      toast.error(`Please enter a valid ${TOTP_CODE_LENGTH}-digit code`);
      return;
    }

    setTwoFAState(prev => ({ ...prev, isVerifying: true }));

    startTransition(async () => {
      try {
        const { error } = await authClient.twoFactor.verifyTotp({
          code: twoFAState.code.trim(),
        });

        if (error) {
          toast.error(error.message || "Invalid 2FA code");
          setTwoFAState(prev => ({ ...prev, code: "", isVerifying: false }));
          return;
        }

        toast.success("Welcome back! Sign in successful.");
        reset2FAState();
        reset();
        router.replace("/dashboard");
        
      } catch (error) {
        console.error("2FA verification error:", error);
        toast.error("Failed to verify 2FA code");
        setTwoFAState(prev => ({ ...prev, code: "", isVerifying: false }));
      }
    });
  }, [twoFAState.code, reset2FAState, reset, router]);

  const onSubmit = useCallback((data: SignInSchemaType) => {
    reset2FAState();

    startTransition(async () => {
      try {
        const { error } = await authClient.signIn.email(
          {
            email: data.email,
            password: data.password,
          },
          {
            async onSuccess(context) {
              if (context.data.twoFactorRedirect) {
                setTwoFAState(prev => ({ ...prev, isActive: true }));
                toast.info("Please enter your 2FA code to complete sign in");
                return;
              }

              toast.success("Welcome back! Sign in successful.");
              reset();
              router.replace("/dashboard");
            },
            async onError(context) {
              console.error("Sign in error:", context.error);
              const errorMessage = context.error.message || "Invalid credentials";

              if (errorMessage.toLowerCase().includes("email")) {
                setError("email", { message: errorMessage });
              } else if (errorMessage.toLowerCase().includes("password")) {
                setError("password", { message: errorMessage });
              } else {
                toast.error(errorMessage);
              }
            },
          }
        );

        if (error && !twoFAState.isActive) {
          toast.error(error.message || "Sign in failed");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        toast.error("An unexpected error occurred");
        reset2FAState();
      }
    });
  }, [reset2FAState, reset, router, setError, twoFAState.isActive]);

  const handle2FAKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && twoFAState.code.length === TOTP_CODE_LENGTH) {
      e.preventDefault();
      handle2FAVerification();
    }
  }, [twoFAState.code.length, handle2FAVerification]);

  return (
    <div className="space-y-6">
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        {...props}
      >
        <FormHeader
          title={twoFAState.isActive ? "Two-Factor Authentication" : "Welcome back"}
          description={
            twoFAState.isActive
              ? "Enter the code from your authenticator app"
              : "Sign in to your account"
          }
        />

        {!twoFAState.isActive ? (
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

            <div className="grid gap-3">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="********"
                register={register("password")}
                error={errors.password?.message}
                disabled={isPending}
              />
              <div className="flex items-center">
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 border-2 transition-all duration-200 cursor-pointer"
              disabled={isPending || !isValid}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-4 mb-2">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative">
                <Input
                  id="totpCode"
                  type="text"
                  placeholder="000000"
                  value={twoFAState.code}
                  onChange={(e) => updateTwoFACode(e.target.value)}
                  onKeyDown={handle2FAKeyPress}
                  maxLength={TOTP_CODE_LENGTH}
                  disabled={twoFAState.isVerifying}
                  className="text-center text-2xl tracking-[0.5em] font-mono h-14 border-2 focus:border-blue-500 transition-all duration-200"
                  autoComplete="one-time-code"
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-describedby="totp-help totp-status"
                  aria-label="Two-factor authentication code"
                />
                
                <div className="flex justify-center mt-3 gap-1">
                  {Array.from({ length: TOTP_CODE_LENGTH }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index < twoFAState.code.length
                          ? 'bg-blue-500 scale-110'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div id="totp-status" className="text-sm font-medium" aria-live="polite">
                  <span className={`transition-colors duration-200 ${
                    twoFAState.code.length === TOTP_CODE_LENGTH 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-muted-foreground'
                  }`}>
                    {twoFAState.code.length} of {TOTP_CODE_LENGTH} digits entered
                  </span>
                </div>
                <p id="totp-help" className="text-xs text-muted-foreground">
                  The code refreshes every 30 seconds
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <Button
                type="button"
                onClick={handle2FAVerification}
                disabled={twoFAState.isVerifying || twoFAState.code.length !== TOTP_CODE_LENGTH}
                className="cursor-pointer w-full h-12 text-base font-mediumdisabled:from-gray-400 disabled:to-gray-500 transition-all duration-200"
              >
                {twoFAState.isVerifying ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Verifying Code...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Verify & Continue</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={reset2FAState}
                disabled={twoFAState.isVerifying}
                className="cursor-pointer w-full h-11 border-2 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        )}

        {!twoFAState.isActive && (
          <FormFooterLink 
            question="Don't have an account?" 
            linkText="Sign Up Now" 
            href="/sign-up" 
          />
        )}
      </form>
    </div>
  );
}