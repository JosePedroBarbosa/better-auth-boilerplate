import Link from "next/link";

interface FormFooterLinkProps {
  question: string;
  linkText: string;
  href: string;
}

export function FormFooterLink({ question, linkText, href }: FormFooterLinkProps) {
  return (
    <div className="text-center text-sm">
      {question}{" "}
      <Link href={href} className="underline underline-offset-4">
        {linkText}
      </Link>
    </div>
  );
}