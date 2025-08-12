import { appName } from "@/constants";
import { LegalSection } from "./legal-section";

export function TermsContent() {
  return (
    <>
      <LegalSection number={1} title="Acceptance of Terms">
        <p>
          By accessing or using {appName}, you agree to be bound by these
          Terms of Service and all applicable laws and regulations. If you
          do not agree with any of these terms, you are prohibited from
          using our platform.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Use of the Service">
        <p>
          You may use our service only for lawful purposes and in accordance
          with these terms. You agree not to misuse the platform, attempt
          unauthorized access, distribute malware, or interfere with its
          operation in any way.
        </p>
      </LegalSection>

      <LegalSection number={3} title="User Accounts">
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You must notify us immediately of any unauthorized use
          of your account.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Content and Conduct">
        <p>
          You are responsible for any content you submit or share through
          {appName}. You agree not to post content that is illegal, harmful,
          threatening, abusive, defamatory, or infringes on other&apos;s rights.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Intellectual Property">
        <p>
          All content, features, and functionality of {appName} are owned
          by us or our licensors and are protected by copyright, trademark,
          and other intellectual property laws.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, we shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of {appName}.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Termination">
        <p>
          We may suspend or terminate your access to {appName} at any time,
          with or without cause, and with or without notice, if you violate
          these terms or engage in prohibited activities.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. We will
          notify you of any changes by updating the Last updated date.
          Your continued use of the service constitutes acceptance of the
          revised terms.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with
          the laws of the jurisdiction where {appName} operates, without
          regard to conflict of law principles.
        </p>
      </LegalSection>
    </>
  );
}