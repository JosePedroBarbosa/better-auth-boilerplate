"use client";

import React, { useTransition, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { onboardingSchema, OnboardingSchemaType } from "@/lib/schemas";
import { onboardingUser } from "../_actions/actions";
import { User, MapPin, Camera, Upload, Globe, CheckCircle } from "lucide-react";

interface Props {
  countries: { value: string; label: string }[];
}

const useImageUpload = () => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadImage, isUploading, preview, setPreview };
};

export default function OnboardingForm({ countries }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { uploadImage, isUploading, preview, setPreview } = useImageUpload();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      photo: "",
    },
    mode: "onChange",
  });

  // Memoizar países mais comuns para melhor UX
  const popularCountries = useMemo(() => {
    const popular = ["us", "gb", "ca", "au", "de", "fr", "es", "it", "pt", "br"];
    const popularList = countries.filter(c => popular.includes(c.value));
    const otherCountries = countries.filter(c => !popular.includes(c.value));
    
    return [
      ...popularList,
      { value: "divider", label: "---" },
      ...otherCountries
    ];
  }, [countries]);

  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de arquivo
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const url = await uploadImage(file);
      setPreview(url);
      setValue("photo", url, { shouldValidate: true });
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    }
  }, [uploadImage, setPreview, setValue]);

  const onSubmit = useCallback((data: OnboardingSchemaType) => {
    startTransition(async () => {
      try {
        const result = await onboardingUser(data);
        
        toast.success("Welcome! Your account is now set up.");
        
        setTimeout(() => {
          router.push("/dashboard?welcome=true");
        }, 1000);
        
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to complete onboarding";
        toast.error(message);
        console.error("Onboarding error:", error);
      }
    });
  }, [router]);

  const watchedValues = watch();
  const completedFields = Object.values({
    firstName: watchedValues.firstName,
    lastName: watchedValues.lastName,
    country: watchedValues.country,
  }).filter(Boolean).length;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex gap-1">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step < completedFields ? "bg-white" : "bg-neutral-600"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-400 ml-2">
            {completedFields}/3 completed
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          Let&apos;s set up your account
        </h1>
        <p className="text-neutral-400">
          First things first, let&apos;s get your profile set up.
        </p>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center overflow-hidden bg-neutral-800 group-hover:border-neutral-500 transition-colors">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile preview"
                  width={112}
                  height={112}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="text-neutral-500 flex flex-col items-center">
                  <Camera className="h-8 w-8 mb-1" />
                  <span className="text-xs">Photo</span>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              </div>
            )}

            {preview && !isUploading && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="h-6 w-6 text-green-500 bg-neutral-900 rounded-full" />
              </div>
            )}
          </div>

          <label htmlFor="photo-upload">
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isUploading || isPending}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={isUploading || isPending}
              className="border-neutral-600 text-neutral-300 hover:border-neutral-500 hover:text-white hover:bg-neutral-800/50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading
                ? "Uploading..."
                : preview
                ? "Change photo"
                : "Upload photo"}
            </Button>
          </label>

          <p className="text-xs text-neutral-500 text-center">
            Optional: Add a profile picture (max 5MB)
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-neutral-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                First Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                disabled={isPending}
                {...register("firstName")}
                className={cn(
                  "bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-500",
                  "focus:border-neutral-400 focus:ring-neutral-400/20",
                  errors.firstName && "border-red-500 focus:border-red-500",
                  watchedValues.firstName && !errors.firstName && "border-green-500/50"
                )}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                  <span className="w-1 h-1 bg-red-400 rounded-full" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-neutral-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Last Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                disabled={isPending}
                {...register("lastName")}
                className={cn(
                  "bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-500",
                  "focus:border-neutral-400 focus:ring-neutral-400/20",
                  errors.lastName && "border-red-500 focus:border-red-500",
                  watchedValues.lastName && !errors.lastName && "border-green-500/50"
                )}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                  <span className="w-1 h-1 bg-red-400 rounded-full" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-neutral-300 flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Country <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full bg-neutral-800/50 border-neutral-600 text-white",
                      "focus:border-neutral-400 focus:ring-neutral-400/20",
                      errors.country && "border-red-500 focus:border-red-500",
                      watchedValues.country && !errors.country && "border-green-500/50"
                    )}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? "country-error" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      <SelectValue placeholder="Select your country" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600 max-h-[200px]">
                    {popularCountries.map((country) => (
                      country.value === "divider" ? (
                        <div key="divider" className="border-t border-neutral-600 my-1" />
                      ) : (
                        <SelectItem
                          key={country.value}
                          value={country.value}
                          className="text-white hover:bg-neutral-700 focus:bg-neutral-700"
                        >
                          {country.label}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p id="country-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                <span className="w-1 h-1 bg-red-400 rounded-full" />
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className={cn(
              "w-full h-12 text-base font-semibold",
              "bg-white text-black hover:bg-neutral-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 cursor-pointer"
            )}
            disabled={isPending || !isValid || isUploading}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                Setting up your account...
              </div>
            ) : (
              "Complete Setup"
            )}
          </Button>

          <p className="text-xs text-neutral-500 text-center mt-3">
            By completing setup, you&apos;ll get access to your dashboard
          </p>
        </div>
      </form>
    </div>
  );
}