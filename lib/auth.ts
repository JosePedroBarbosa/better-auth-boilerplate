import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins"
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

const resend = new Resend(process.env.RESEND_API_KEY as string);

import ForgotPasswordEmail from "@/components/auth/ResetPasswordEmail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
    requireEmailVerification: false,
  },
  rateLimit: {
    window: 60,
    max: 100, 
    enabled: process.env.NODE_ENV === 'production', 
  },
  appName: "Next Project",
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        authorizeReference: async ({ referenceId, user }) => {
          return referenceId === user.id;
        },
        enabled: true,
        plans: [
          {
            name: "basic",
            priceId: "price_1RolSwJf7j9V8THhWCnCzglN",
            annualDiscountPriceId: "price_1RolTOJf7j9V8THhXNadpGgW",
            limits: { projects: 5, storage: 10 },
          },
          {
            name: "pro",
            priceId: "price_1RolTpJf7j9V8THh8u6lsvIZ",
            annualDiscountPriceId: "price_1RolUAJf7j9V8THhgHlX6Sd0",
            freeTrial: { days: 14 },
            limits: { projects: 20, storage: 50 },
          },
          {
            name: "business",
            priceId: "price_1RolUbJf7j9V8THh1wU2n7Cw",
            annualDiscountPriceId: "price_1RolUwJf7j9V8THhjmFqF6Yz",
            limits: { projects: -1, storage: -1 }, // unlimited
          },
        ],
      },
    }),
    twoFactor(),
  ],
});
