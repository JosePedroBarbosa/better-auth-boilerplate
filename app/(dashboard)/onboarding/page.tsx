import countriesData from "world-countries";
import OnboardingForm from "./_components/OnboardingForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Complete Your Profile",
  description: "Set up your account to get started with our platform",
};

export default function OnboardingPage() {
  const countries = countriesData
    .map((country) => ({
      value: country.cca2.toLowerCase(),
      label: country.name.common,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return <OnboardingForm countries={countries} />;
}