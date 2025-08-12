// components/form/form-header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg"; 

interface FormHeaderProps {
  title: string;
  description: string;
}

export function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex justify-center">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex w-16 h-16 items-center justify-center mb-2">
            <Image
              src={Logo}
              alt="Logo"
              width={48}
              height={48}
              className="w-16 h-16 dark:invert"
            />
          </div>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm mb-2">{description}</p>
    </div>
  );
}