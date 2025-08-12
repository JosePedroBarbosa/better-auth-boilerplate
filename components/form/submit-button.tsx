import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function SubmitButton({ isLoading, children }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full h-11 border-2 transition-all duration-200 cursor-pointer" 
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}