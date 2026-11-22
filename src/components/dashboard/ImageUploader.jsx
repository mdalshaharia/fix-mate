"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadImageToImgBB } from "@/lib/uploadImage";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;

export default function ImageUploader({ value, onChange, uploading, onUploadingChange }) {
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleFile(file) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG or PNG images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB} MB`);
      return;
    }

    onUploadingChange(true);
    try {
      onChange(await uploadImageToImgBB(file));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    } finally {
      onUploadingChange(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the link and copy it manually.");
    }
  }

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
          { }
          <Image src={value} alt="Uploaded service image" fill unoptimized className="object-cover" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image-link" className="text-xs">Image link</Label>
          <div className="flex gap-2">
            <Input
              id="image-link"
              value={value}
              readOnly
              onFocus={(e) => e.target.select()}
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyLink}
              aria-label="Copy image link"
            >
              {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onChange("")}
        >
          <Trash2 className="size-4" />
          Remove image
        </Button>
      </div>
    );
  }

  return (
    <label
      htmlFor="image"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "flex min-h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center transition-colors hover:bg-primary/10 focus-within:ring-2 focus-within:ring-ring",
        dragging && "border-primary bg-primary/10",
        uploading && "pointer-events-none opacity-70"
      )}
    >
      <input
        id="image"
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary">
        {uploading ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
      </span>
      <span aria-live="polite" className="text-sm font-semibold">
        {uploading ? "Uploading..." : "Upload an image"}
      </span>
      <span className="text-xs text-muted-foreground">JPG or PNG, up to {MAX_SIZE_MB} MB</span>
    </label>
  );
}