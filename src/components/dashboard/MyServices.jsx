"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApprovalBadge } from "@/components/utils/dashboard/StatusBadge";
import { authorizedFetch } from "@/lib/getTokenFromClient";


function ServiceCell({ service }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
        {service.image ? (
          <Image src={service.image} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <Wrench className="size-4 text-primary" />
        )}
      </div>
      <p className="text-sm font-semibold">{service.title}</p>
    </div>
  );
}

function AvailabilityToggle({ service, onToggle }) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={service.isAvailable}
        onCheckedChange={() => onToggle(service)}
        aria-label={`Availability of ${service.title}`}
      />
      <span className="text-xs text-muted-foreground">
        {service.isAvailable ? "Visible" : "Hidden"}
      </span>
    </div>
  );
}

function ServiceActions({ service, onDelete }) {
  return (
    <div className="flex justify-end gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/dashboard/technician/services/${service._id}/edit`}>Edit</Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-destructive/30 text-destructive hover:text-destructive"
        onClick={() => onDelete(service)}
      >
        Delete
      </Button>
    </div>
  );
}

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      const res = await authorizedFetch("/services/my");
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || "Failed to load services");
      setServices(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadServices();
    });
    return () => {
      cancelled = true;
    };
  }, [loadServices]);

  const setAvailability = (id, isAvailable) =>
    setServices((prev) => prev.map((s) => (s._id === id ? { ...s, isAvailable } : s)));

  // Optimistic: the switch moves right away and rolls back if the server refuses
  async function handleToggle(service) {
    const next = !service.isAvailable;
    setAvailability(service._id, next);
    try {
      const res = await authorizedFetch(`/services/${service._id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update availability");
      toast.success(next ? "Service is visible again" : "Service hidden from public pages");
    } catch (err) {
      setAvailability(service._id, !next);
      toast.error(err.message);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await authorizedFetch(`/services/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to delete service");
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.message);
      loadServices();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="py-16 text-center text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">You have not added any services yet.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/technician/add-service">Add your first service</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Table: tablet and desktop */}
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s._id}>
                <TableCell><ServiceCell service={s} /></TableCell>
                <TableCell className="text-sm">{s.category}</TableCell>
                <TableCell className="text-sm font-medium">${s.basePrice}</TableCell>
                <TableCell><ApprovalBadge approvalStatus={s.approvalStatus} /></TableCell>
                <TableCell><AvailabilityToggle service={s} onToggle={handleToggle} /></TableCell>
                <TableCell><ServiceActions service={s} onDelete={setDeleteTarget} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cards: mobile */}
      <div className="space-y-3 md:hidden">
        {services.map((s) => (
          <article key={s._id} className="space-y-3 rounded-xl border bg-card p-4">
            <ServiceCell service={s} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{s.category}</span>
              <span className="text-sm font-medium text-foreground">${s.basePrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <ApprovalBadge approvalStatus={s.approvalStatus} />
              <AvailabilityToggle service={s} onToggle={handleToggle} />
            </div>
            <ServiceActions service={s} onDelete={setDeleteTarget} />
          </article>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} will be removed permanently. Existing bookings keep their own
              copy of the details. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep service</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault(); // keep the dialog open until the request finishes
                confirmDelete();
              }}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}