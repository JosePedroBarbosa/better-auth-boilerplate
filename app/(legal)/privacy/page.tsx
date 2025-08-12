import type { Metadata } from "next";
import { LegalLayout, PrivacyContent } from "@/components/legal";
import { LEGAL_CONSTANTS } from "@/constants/legal";

export const metadata: Metadata = {
  title: LEGAL_CONSTANTS.PRIVACY_POLICY.TITLE,
  description: LEGAL_CONSTANTS.PRIVACY_POLICY.DESCRIPTION,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title={LEGAL_CONSTANTS.PRIVACY_POLICY.TITLE}
      lastUpdated={LEGAL_CONSTANTS.LAST_UPDATED}
    >
      <PrivacyContent />
    </LegalLayout>
  );
}