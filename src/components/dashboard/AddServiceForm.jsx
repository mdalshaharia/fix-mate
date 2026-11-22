"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SERVICE_MODES } from "@/components/utils/services/constants";
import { authorizedFetch } from "@/lib/getTokenFromClient";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

const SERVICES_URL = "/dashboard/technician/services";
const MIN_DESCRIPTION = 20;

const INITIAL_FORM = {
    title: "",
    category: "",
    basePrice: "",
    estimatedDuration: "",
    serviceArea: "",
    serviceMode: "",
    description: "",
};

const toFormState = (service) => ({
    title: service.title ?? "",
    category: service.category ?? "",
    basePrice: String(service.basePrice ?? ""),
    estimatedDuration: service.estimatedDuration ?? "",
    serviceArea: service.serviceArea ?? "",
    serviceMode: service.serviceMode ?? "",
    description: service.description ?? "",
});

function validate(form) {
    const errors = {};
    const price = Number(form.basePrice);

    if (form.title.trim().length < 3) errors.title = "Enter a title (at least 3 characters)";
    if (!form.category) errors.category = "Select a category";
    if (!form.basePrice || !(price > 0)) errors.basePrice = "Enter a price above 0";
    if (!form.estimatedDuration.trim()) errors.estimatedDuration = "Enter the estimated time";
    if (!form.serviceArea.trim()) errors.serviceArea = "Enter your service area";
    if (!form.serviceMode) errors.serviceMode = "Select a service mode";
    if (form.description.trim().length < MIN_DESCRIPTION) {
        errors.description = `Describe your service in at least ${MIN_DESCRIPTION} characters`;
    }
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

export default function AddServiceForm({ service }) {
    const router = useRouter();
    const isEdit = !!service;

    const [form, setForm] = useState(isEdit ? toFormState(service) : INITIAL_FORM);
    const [image, setImage] = useState(service?.image || "");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);


    function setField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    const handleChange = (e) => setField(e.target.name, e.target.value);

    async function handleSubmit(e) {
        e.preventDefault();

        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
            const payload = { ...form, basePrice: Number(form.basePrice), image };
            const options = {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            };
            const res = await authorizedFetch(isEdit ? `/services/${service._id}` : "/services", options);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to save service");

            if (isEdit) {
                toast.success("Changes saved", {
                    description: "The service is Pending until an admin approves it again.",
                });
            } else {
                toast.success("Service submitted", {
                    description: "It will appear after an admin approves it.",
                });
            }
            router.push(SERVICES_URL);
        } catch (error) {
            toast.error(error.message || "Failed to save service");
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
            { }
            <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:col-start-1 lg:row-start-1">
                <Field id="title" label="Service title" error={errors.title}>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Smartphone Screen Replacement"
                        maxLength={100}
                        aria-invalid={!!errors.title}
                    />
                </Field>

                <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                    <Field id="category" label="Category" error={errors.category}>
                        <Select value={form.category} onValueChange={(value) => setField("category", value)}>
                            <SelectTrigger id="category" className="w-full" aria-invalid={!!errors.category}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>{c.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field id="basePrice" label="Starting price ($)" error={errors.basePrice}>
                        <Input
                            id="basePrice"
                            name="basePrice"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            step="0.01"
                            value={form.basePrice}
                            onChange={handleChange}
                            placeholder="45"
                            aria-invalid={!!errors.basePrice}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="estimatedDuration" label="Estimated time" error={errors.estimatedDuration}>
                        <Input
                            id="estimatedDuration"
                            name="estimatedDuration"
                            value={form.estimatedDuration}
                            onChange={handleChange}
                            placeholder="1 to 2 hours"
                            aria-invalid={!!errors.estimatedDuration}
                        />
                    </Field>

                    <Field id="serviceArea" label="Service area" error={errors.serviceArea}>
                        <Input
                            id="serviceArea"
                            name="serviceArea"
                            value={form.serviceArea}
                            onChange={handleChange}
                            placeholder="City or area"
                            aria-invalid={!!errors.serviceArea}
                        />
                    </Field>
                </div>

                <Field id="serviceMode" label="Service mode" error={errors.serviceMode}>
                    <Select value={form.serviceMode} onValueChange={(value) => setField("serviceMode", value)}>
                        <SelectTrigger id="serviceMode" className="w-full" aria-invalid={!!errors.serviceMode}>
                            <SelectValue placeholder="Select a service mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {SERVICE_MODES.map((mode) => (
                                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field id="description" label="Description" error={errors.description}>
                    <Textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe what you repair and what is included"
                        aria-invalid={!!errors.description}
                    />
                </Field>
            </section>

            { }
            <aside className="space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
                    <h2 className="text-sm font-bold">Service image</h2>
                    <ImageUploader
                        value={image}
                        onChange={setImage}
                        uploading={uploading}
                        onUploadingChange={setUploading}
                    />
                </section>

                <p
                    role="note"
                    className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                >
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>
                        {isEdit ? (
                            <>Saving changes sends this service back to <strong>Pending</strong> until an admin approves it again.</>
                        ) : (
                            <>After you submit, this service stays <strong>Pending</strong> until an admin approves it.</>
                        )}
                    </span>
                </p>
            </aside>

            { }
            <div className="flex gap-3 lg:col-start-1 lg:row-start-2">
                <Button type="submit" disabled={submitting || uploading}>
                    {submitting ? "Saving..." : isEdit ? "Save Changes" : "Submit for Approval"}
                </Button>
                <Button asChild variant="outline">
                    <Link href={SERVICES_URL}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}