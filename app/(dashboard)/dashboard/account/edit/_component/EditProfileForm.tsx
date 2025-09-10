"use client";

import { useState, useCallback, useMemo, useTransition } from "react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Save,
  Upload,
  User,
  Camera,
  Loader2,
  AlertCircle,
  X,
  Info,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "use-debounce";

import countries from "world-countries";

import { editProfileSchema, EditProfileSchemaType } from "@/lib/schemas";
import { updateProfile, checkUsernameAvailability } from "../_actions/server";

interface User {
  id: string;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  name: string | null;
}

// Componente de campo otimizado com memo
const FormField = React.memo(
  ({
    label,
    error,
    children,
    description,
    required = true,
  }: {
    label: string;
    error?: any;
    children: React.ReactNode;
    description?: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {description}
        </p>
      )}
      {error && (
        <p
          className="text-destructive text-sm flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-3 w-3" />
          {error.message}
        </p>
      )}
    </div>
  )
);

FormField.displayName = "FormField";

export default function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [image, setImage] = useState(user.image ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      name: user.name ?? "",
      country: user.country ? user.country.toUpperCase() : "",
    },
  });

  // Watch form values for changes
  const watchedValues = watch();

  // Memoizar lista de países para performance
  const countryList = useMemo(() => {
    const list = countries.map((c) => ({
      code: c.cca2.toUpperCase(),
      name: c.name.common,
      flag: c.flag,
    }));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const selectedCountry = useMemo(
    () => countryList.find((c) => c.code === watchedValues.country),
    [countryList, watchedValues.country]
  );

  // Debounced username check
  const debouncedUsernameCheck = useDebouncedCallback(
    async (username: string) => {
      if (!username || username === user.name || username.length < 3) {
        setUsernameStatus("idle");
        return;
      }

      setUsernameStatus("checking");
      try {
        const result = await checkUsernameAvailability(username);
        setUsernameStatus(result.available ? "available" : "taken");
      } catch (error) {
        setUsernameStatus("idle");
        console.error("Username check error:", error);
      }
    },
    500
  );

  // Effect para verificar username
  React.useEffect(() => {
    debouncedUsernameCheck(watchedValues.name);
  }, [watchedValues.name, debouncedUsernameCheck]);

  const uploadImageToCloudinary = useCallback(
    async (file: File): Promise<string> => {
      if (
        !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ) {
        throw new Error("Cloudinary configuration missing");
      }

      setUploadingImage(true);
      setImageError(null);

      try {
        // Validações melhoradas
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image size must be less than 5MB");
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("Please select a valid image file");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
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
        setUploadingImage(false);
      }
    },
    []
  );

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const url = await uploadImageToCloudinary(file);
        setImage(url);
        setHasChanges(true);
        toast.success("Profile image updated!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image";
        setImageError(errorMessage);
        toast.error(errorMessage);
        console.error(error);
      }
    },
    [uploadImageToCloudinary]
  );

  const getInitials = useCallback(() => {
    if (watchedValues.firstName && watchedValues.lastName) {
      return `${watchedValues.firstName[0]}${watchedValues.lastName[0]}`.toUpperCase();
    }
    if (watchedValues.name) {
      return watchedValues.name.slice(0, 2).toUpperCase();
    }
    return "U";
  }, [watchedValues.firstName, watchedValues.lastName, watchedValues.name]);

  const onSubmit = useCallback(
    async (data: EditProfileSchemaType) => {
      startTransition(async () => {
        try {
          const result = await updateProfile({
            firstName: data.firstName,
            lastName: data.lastName,
            name: data.name,
            image,
            country: data.country.toLowerCase(),
          });

          if (result.success) {
            setHasChanges(false);
            toast.success("Profile updated successfully!");
            router.refresh();
            router.push("/dashboard/account");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update profile";
          toast.error(errorMessage);
          console.error("Profile update error:", error);
        }
      });
    },
    [image, router]
  );

  const triggerFileInput = useCallback(() => {
    document.getElementById("photo-upload")?.click();
  }, []);

  const clearImage = useCallback(() => {
    setImage("");
    setHasChanges(true);
    setImageError(null);
    toast.success("Profile image removed");
  }, []);

  const isFormChanged = isDirty || hasChanges || image !== user.image;
  const canSubmit =
    isFormChanged && usernameStatus !== "taken" && !uploadingImage;

  return (
    <div className="container max-w-6xl mx-auto px-4 space-y-8">
      <DashboardHeader
        title="Edit Profile"
        description="Update your personal information and profile picture"
        backHref="/dashboard/account"
        backLabel="Back to Account"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 flex-shrink-0" />
              <div>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload or change your photo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar
                  className="h-32 w-32 cursor-pointer border-4 border-muted group-hover:border-primary transition-all duration-200 shadow-lg"
                  onClick={triggerFileInput}
                >
                  <AvatarImage
                    src={image || undefined}
                    alt="Profile picture"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                {/* Loading overlay */}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}

                {/* Remove image button */}
                {image && !uploadingImage && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="cursor-pointer absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors shadow-md"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="text-center space-y-3 w-full">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    disabled={uploadingImage}
                    className="flex-1 cursor-pointer"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {image ? "Change" : "Upload"}
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Maximum file size: 5MB</p>
                  <p>Minimum dimensions: 100x100px</p>
                  <p>Supported formats: JPG, PNG, GIF</p>
                </div>
              </div>

              {imageError && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{imageError}</AlertDescription>
                </Alert>
              )}
            </div>

            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 flex-shrink-0" />
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic profile details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="First Name" error={errors.firstName}>
                  <Input
                    {...register("firstName")}
                    placeholder="Enter your first name"
                    aria-invalid={!!errors.firstName}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                </FormField>

                <FormField label="Last Name" error={errors.lastName}>
                  <Input
                    {...register("lastName")}
                    placeholder="Enter your last name"
                    aria-invalid={!!errors.lastName}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                </FormField>
              </div>

              {/* Username com validação em tempo real */}
              <FormField
                label="Username"
                error={errors.name}
                description="This will be your public display name (3-30 characters)"
              >
                <div className="relative">
                  <Input
                    {...register("name")}
                    placeholder="Choose a unique username"
                    aria-invalid={!!errors.name}
                    className={`${errors.name ? "border-destructive" : ""} ${
                      usernameStatus === "available" ? "border-green-500" : ""
                    } ${usernameStatus === "taken" ? "border-destructive" : ""}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {usernameStatus === "checking" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {usernameStatus === "available" && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    {usernameStatus === "taken" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                {usernameStatus === "taken" && (
                  <p className="text-destructive text-sm">
                    Username is already taken
                  </p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-green-600 text-sm">
                    Username is available
                  </p>
                )}
              </FormField>

              {/* Country */}
              <FormField
                label="Country"
                error={errors.country}
                description="Select your country of residence"
              >
                <Select
                  value={watchedValues.country}
                  onValueChange={(value) =>
                    setValue("country", value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger
                    className={`cursor-pointer w-full ${errors.country ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.country}
                  >
                    <SelectValue placeholder="Select your country">
                      {selectedCountry && (
                        <div className="flex items-center gap-2">
                          <span>{selectedCountry.flag}</span>
                          <span>{selectedCountry.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countryList.map(({ code, name, flag }) => (
                      <SelectItem className="cursor-pointer" key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{flag}</span>
                          <span>{name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                  className="flex-1 sm:flex-none sm:min-w-[180px] cursor-pointer"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Link href="/dashboard/account" className="flex-1 sm:flex-none">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}