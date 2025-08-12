import { appName } from "@/constants";
import { LegalSection } from "./legal-section";

export function PrivacyContent() {
  return (
    <>
      <LegalSection number={1} title="Information We Collect">
        <p>
          We collect personal information such as your name, email address,
          and usage data to improve our services and provide you with a
          personalized experience.
        </p>
      </LegalSection>

      <LegalSection number={2} title="How We Use Your Information">
        <p>
          Your data helps us provide better services, improve the user
          experience, send you important updates about {appName}, and
          ensure the security of our platform.
        </p>
      </LegalSection>

      <LegalSection number={3} title="Data Sharing">
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We may share your data only when required by law, to
          protect our services, or with your explicit consent.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Data Security">
        <p>
          We implement industry-standard security measures to protect your
          information. However, no method of transmission over the internet
          or electronic storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Your Rights">
        <p>
          You have the right to access, correct, update, or delete your
          personal data at any time. You may also object to or restrict
          certain processing of your information. Contact us to exercise
          these rights.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Cookies and Tracking">
        <p>
          We use cookies and similar technologies to enhance your experience,
          analyze usage patterns, and remember your preferences. You can
          control cookie settings through your browser.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Contact Us">
        <p>
          If you have any questions about this Privacy Policy or how we
          handle your data, please contact us through our support channels.
        </p>
      </LegalSection>
    </>
  );
}