import { z } from "zod"

// Edit profile form
export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long"),
  country: z.string().min(2, "Please select a country"),
});

// Security password change form
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
});

// Position form schema
export const positionSchema = z.object({
  symbol: z.string().min(1, "Crypto is mandatory"),
  price: z.number().positive("Price must be positive."),
  date: z.date(),
  amount: z.number().refine((val) => val !== 0, "Value cannot be zero."),
  fee: z.number().min(0, "Rate cannot be negative."),
  quantity: z.number().refine((val) => val !== 0, "Quantity cannot be zero.")
});

// Forgot password form
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

// Reset password form
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Sign up form
export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Sign in form
export const signInSchema = z.object({
  email: z.string().email("Insert a valid email"),
  password: z.string().min(1, "The password must have at least 1 character"),
});

// Onboarding form
export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name must have at least 2 characters"),
  lastName: z.string().min(2, "Last name must have at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  photo: z.string().optional(),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
export type PasswordChangeSchemaType = z.infer<typeof passwordChangeSchema>
export type PositionSchemaType = z.infer<typeof positionSchema>
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;