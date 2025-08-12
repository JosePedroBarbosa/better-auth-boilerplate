import { FormHeader } from "@/components/form/form-header";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export function LegalLayout({ 
  children, 
  title, 
  lastUpdated 
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 md:p-10 max-w-3xl mx-auto">
      <FormHeader
        title={title}
        description={`Last updated: ${lastUpdated}`}
      />
      
      <div className="space-y-6 text-sm leading-relaxed text-foreground pt-5">
        {children}
      </div>
    </div>
  );
}