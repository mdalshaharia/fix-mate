"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;
const MAX_BIO = 300;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

function validate(form) {
  const errors = {};
  const name = form.name.trim();

  if (name.length < 2 || name.length > 60) errors.name = "Enter your name (2 to 60 characters)";
  if (form.phone.trim() && !PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (form.bio.trim().length > MAX_BIO) errors.bio = `Bio must be ${MAX_BIO} characters or fewer`;
  return errors;
}

function Field({ id, label, error, className, children }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ProfileForm({ user }) {
  const router = useRouter();

  const saved = {
    name: user.name ?? "",
    phone: user.phone ?? "",
    area: user.area ?? "",
    bio: user.bio ?? "",
  };

  const [form, setForm] = useState(saved);
  const [image, setImage] = useState(user.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  async function handlePhoto(file) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG or PNG images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB} MB`);
      return;
    }

    setUploading(true);
    try {
      setImage(await uploadImageToImgBB(file));
      toast.success("Photo uploaded. Click Save Changes to keep it.");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Could not save your profile");
        return;
      }

      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(saved);
    setImage(user.image ?? "");
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
    >
      { }
      <section className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-sm">
        <Avatar className="size-24">
          <AvatarImage src={image} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <p className="text-base font-bold">{user.name}</p>
          {

}
        </div>

        <label
          htmlFor="photo"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading..." : "Change photo"}
          <input
            id="photo"
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              handlePhoto(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </label>

        <p className="text-xs text-muted-foreground">JPG or PNG, up to {MAX_SIZE_MB} MB</p>
      </section>

      { }
      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Full name" error={errors.name}>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={60}
              aria-invalid={!!errors.name}
            />
          </Field>

          <Field id="email" label="Email">
            <Input id="email" value={user.email} readOnly className="bg-muted" />
          </Field>

          <Field id="phone" label="Phone" error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+000 000 000 000"
              aria-invalid={!!errors.phone}
            />
          </Field>

          <Field id="role" label="Role">
            <Input id="role" value={user.role} readOnly className="bg-muted capitalize" />
          </Field>
        </div>

        <Field id="area" label="Area">
          <Input
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="City or area"
            maxLength={100}
          />
        </Field>

        <Field id="bio" label="Bio" error={errors.bio}>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell people a little about yourself"
            aria-invalid={!!errors.bio}
          />
          <p className="text-right text-xs text-muted-foreground">
            {form.bio.trim().length}/{MAX_BIO}
          </p>
        </Field>

        <div className="flex gap-3">
          <Button className='bg-brand-primary' type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" disabled={saving} onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </section>
    </form>
  );
}

export default function ProfileView() {
  const { data: session, isPending: loading } = useSession();
  const user = session?.user;

  if (loading || !user) return <Skeleton className="h-96 w-full rounded-2xl" />;
  return <ProfileForm user={user} />;
}