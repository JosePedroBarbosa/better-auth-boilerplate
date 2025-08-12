import type { Metadata } from "next";
import { LegalLayout, TermsContent } from "@/components/legal";
import { LEGAL_CONSTANTS } from "@/constants/legal";

export const metadata: Metadata = {
  title: LEGAL_CONSTANTS.TERMS_OF_SERVICE.TITLE,
  description: LEGAL_CONSTANTS.TERMS_OF_SERVICE.DESCRIPTION,
};

export default function TermsPage() {
  return (
    <LegalLayout
      title={LEGAL_CONSTANTS.TERMS_OF_SERVICE.TITLE}
      lastUpdated={LEGAL_CONSTANTS.LAST_UPDATED}
    >
      <TermsContent />
    </LegalLayout>
  );
}