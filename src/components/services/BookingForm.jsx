"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "@/lib/auth-client";
// import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
// import { getAuthHeader, useCurrentUser } from "@/lib/useCurrentUser";

const MIN_PROBLEM_LENGTH = 20;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

// Local date -> "YYYY-MM-DD" (toISOString() would shift the day in some timezones)
function toDateString(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

export default function BookingForm({ service, isAvailable }) {
    const router = useRouter();
    const pathname = usePathname();
    //   const { user, loading } = useCurrentUser();
    const {
        data: user,
        isPending: loading
    } = useSession();
    console.log(user)

    const [form, setForm] = useState({ phone: "", address: "", problem: "" });
    const [date, setDate] = useState();
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isCustomer = user?.user?.role === "customer";
    // Change "callbackUrl" if your auth library uses another name (e.g. "redirect")
    const signInUrl = `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`;

    // Logged-out users can click (to be redirected); other roles cannot
    const canClick = isAvailable && !loading && (!user || isCustomer);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function validate() {
        const next = {};
        if (!PHONE_REGEX.test(form.phone.trim())) next.phone = "Enter a valid phone number";
        if (form.address.trim().length < 5) next.address = "Enter your full address";
        if (!date) next.date = "Select a preferred date";
        else if (date < today) next.date = "Date cannot be in the past";
        if (form.problem.trim().length < MIN_PROBLEM_LENGTH) {
            next.problem = `Describe the problem in at least ${MIN_PROBLEM_LENGTH} characters`;
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!user) {
            router.push(signInUrl);
            return;
        }
        if (!validate()) return;

        setSubmitting(true);
        console.log(`http://localhost:5000/bookings`)
        try {
            const res = await fetch(`http://localhost:5000/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serviceId: String(service._id),
                    serviceTitle: service.title,
                    serviceImage: service.image || "",
                    category: service.category,
                    basePrice: service.basePrice,
                    technicianName: service.technicianName,
                    technicianEmail: service.technicianEmail,
                    customerName: user?.user?.name || "",
                    customerEmail: user?.user?.email || "",
                    customerPhone: form.phone.trim(),
                    address: form.address.trim(),
                    preferredDate: toDateString(date),
                    problemDescription: form.problem.trim(),
                    status: "pending",
                    finalAmount: service.basePrice,
                    paymentStatus: "unpaid",
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // Includes: "You already have an active request for this service"
                toast.error(data.message || "Could not send your request. Please try again.");
                return;
            }

            toast.success("Repair request sent!", {
                description: "The technician will review and respond soon.",
                action: { label: "My Bookings", onClick: () => router.push("/my-bookings") },
            });
            setForm({ phone: "", address: "", problem: "" });
            setDate(undefined);
            setErrors({});
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
        >
            <div>
                <h2 className="text-base font-bold">Send a repair request</h2>
                <p className="text-xs text-muted-foreground">
                    The technician will review it and accept or reject.
                </p>
            </div>

            {/* Read-only fields from the session */}
            <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user?.user?.name || ""} placeholder="Sign in to fill this" readOnly className="bg-muted" />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.user?.email || ""} placeholder="Sign in to fill this" readOnly className="bg-muted" />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+000 000 000 000"
                    aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House, road, area, city"
                    aria-invalid={!!errors.address}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="date">Preferred date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                        render={
                            <Button
                                id="date"
                                type="button"
                                variant="outline"
                                className="w-full justify-between font-normal"
                                aria-invalid={!!errors.date}
                            />
                        }
                    >
                        <span className={date ? "" : "text-muted-foreground"}>
                            {date
                                ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                                : "Select a date"}
                        </span>
                        <CalendarIcon className="size-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selected) => {
                                setDate(selected);
                                setCalendarOpen(false);
                            }}
                            disabled={{ before: today }} // today or later only
                        />
                    </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="problem">Problem description</Label>
                <Textarea
                    id="problem"
                    name="problem"
                    rows={4}
                    value={form.problem}
                    onChange={handleChange}
                    placeholder="Describe what is wrong"
                    aria-invalid={!!errors.problem}
                />
                <div className="flex justify-between text-xs">
                    <span className="text-destructive">{errors.problem}</span>
                    <span className="text-muted-foreground">
                        {form.problem.trim().length}/{MIN_PROBLEM_LENGTH} min
                    </span>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={!canClick || submitting}>
                {submitting ? "Sending..." : "Send Request"}
            </Button>

            {/* Notices */}
            {!isAvailable && (
                <p className="text-center text-xs text-muted-foreground">
                    This service is not accepting requests right now.
                </p>
            )}
            {!loading && user && !isCustomer && (
                <p role="alert" className="text-center text-xs font-medium text-destructive">
                    Only customers can request a repair.
                </p>
            )}
            {!loading && !user && (
                <p className="text-center text-xs text-muted-foreground">
                    Not signed in?{" "}
                    <Link href={signInUrl} className="font-semibold text-primary hover:underline">
                        Sign in
                    </Link>{" "}
                    as a customer to send a request.
                </p>
            )}

            <p className="flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                You pay only after the job is completed.
            </p>
        </form>
    );
}