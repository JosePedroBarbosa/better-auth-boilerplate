import Link from "next/link";
import { cn } from "@/lib/utils"; 

interface FormFooterProps {
  className?: string;
}

export default function FormFooter({ className }: FormFooterProps) {
  return (
    <footer className={cn("text-center text-xs text-muted-foreground", className)}>
      By continuing, you agree to our{" "}
      <Link href="/terms" className="underline hover:text-primary">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="underline hover:text-primary">
        Privacy Policy
      </Link>
      .
    </footer>
  );
}
