interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
  number: number;
}

export function LegalSection({ 
  title, 
  children,
  number
}: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">
        {number}. {title}
      </h2>
      <div className="text-muted-foreground">
        {children}
      </div>
    </section>
  );
}