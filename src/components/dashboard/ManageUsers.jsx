"use client";

import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authorizedFetch } from "@/lib/getTokenFromClient";
import { useSession } from "@/lib/auth-client";

const ROLES = ["customer", "technician", "admin"];
const formatJoinedDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const isSessionError = (message = "") =>
  message.includes("session-expired") || message.includes("Unauthorized");

const toastError = (message) => {
  if (isSessionError(message)) return; // handleExpiredSession already toasts + redirects
  toast.error(message);
};

function UserCell({ user, isSelf }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.image} alt="" />
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {user.name}
          {isSelf && <Badge variant="secondary">You</Badge>}
          {user.banned && (
            <Badge variant="destructive" className="text-[10px]">Banned</Badge>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}

// The select only asks for a change; the role updates after the admin confirms
function RoleSelect({ user, isSelf, onChange }) {
  return (
    <Select
      value={user.role}
      onValueChange={(role) => onChange(user, role)}
      disabled={isSelf || user.banned}
    >
      <SelectTrigger
        className="w-36 capitalize"
        aria-label={`Role of ${user.name}`}
        title={
          isSelf
            ? "You cannot change your own role"
            : user.banned
              ? "Unban this user to change their role"
              : undefined
        }
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function ManageUsers() {
  const { data: currentUser } = useSession();

  const [page, setPage] = useState(1);
  const [data, setData] = useState({ users: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [pendingChange, setPendingChange] = useState(null); // { user, role }
  const [pendingBan, setPendingBan] = useState(null); // { user, banned }
  const [saving, setSaving] = useState(false);

  // `ignore` drops answers from outdated requests
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await authorizedFetch(`/admin/users?page=${page}&limit=10`);
        const payload = await res.json().catch(() => null);
        if (ignore) return;
        if (!res.ok) throw new Error(payload?.message || "Failed to load users");
        setData({
          users: Array.isArray(payload?.users) ? payload.users : [],
          total: payload?.total ?? 0,
          page: payload?.page ?? page,
          totalPages: payload?.totalPages ?? 1,
        });
        setError("");
      } catch (err) {
        if (!ignore) {
          setData((prev) => ({ ...prev, users: [] }));
          setError(isSessionError(err.message) ? "Your session has expired." : err.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [page, reloadKey]);

  function goToPage(nextPage) {
    setLoading(true);
    setPage(nextPage);
  }

  async function confirmRoleChange() {
    setSaving(true);
    try {
      const res = await authorizedFetch(`/admin/users/${pendingChange.user._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pendingChange.role }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.message || "Could not change role");
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u._id === pendingChange.user._id ? { ...u, role: pendingChange.role } : u
        ),
      }));
      toast.success(`${pendingChange.user.name} is now ${pendingChange.role}`);
    } catch (err) {
      toastError(err.message);
      setReloadKey((key) => key + 1);
    } finally {
      setSaving(false);
      setPendingChange(null);
    }
  }

  async function confirmBanChange() {
    setSaving(true);
    const { user, banned } = pendingBan;
    try {
      const res = await authorizedFetch(`/admin/users/${user._id}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.message || "Could not update ban status");
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u._id === user._id ? { ...u, banned } : u
        ),
      }));
      toast.success(banned ? `${user.name} has been banned` : `${user.name} has been unbanned`);
    } catch (err) {
      toastError(err.message);
      setReloadKey((key) => key + 1);
    } finally {
      setSaving(false);
      setPendingBan(null);
    }
  }

  const requestRoleChange = (user, role) => {
    if (role !== user.role) setPendingChange({ user, role });
  };

  const requestBanChange = (user, banned) => {
    setPendingBan({ user, banned });
  };

  const isSelf = (user) =>
    String(user._id) === String(currentUser?.user?.id ?? "");

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
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

  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">{data.total} users</p>

      {/* Table: tablet and desktop */}
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((u) => (
              <TableRow key={u._id} className={u.banned ? "opacity-70" : undefined}>
                <TableCell><UserCell user={u} isSelf={isSelf(u)} /></TableCell>
                <TableCell><RoleSelect user={u} isSelf={isSelf(u)} onChange={requestRoleChange} /></TableCell>
                <TableCell className="text-sm">{formatJoinedDate(u.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {!isSelf(u) && (
                    <Button
                      size="sm"
                      variant={u.banned ? "outline" : "destructive"}
                      disabled={saving}
                      onClick={() => requestBanChange(u, !u.banned)}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cards: mobile */}
      <div className="space-y-3 md:hidden">
        {data.users.map((u) => (
          <article key={u._id} className="space-y-3 rounded-xl border bg-card p-4">
            <UserCell user={u} isSelf={isSelf(u)} />
            <div className="flex items-center justify-between gap-2">
              <RoleSelect user={u} isSelf={isSelf(u)} onChange={requestRoleChange} />
              <span className="text-xs text-muted-foreground">
                Joined {formatJoinedDate(u.createdAt)}
              </span>
            </div>
            {!isSelf(u) && (
              <Button
                size="sm"
                variant={u.banned ? "outline" : "destructive"}
                className="w-full"
                disabled={saving}
                onClick={() => requestBanChange(u, !u.banned)}
              >
                {u.banned ? "Unban" : "Ban"}
              </Button>
            )}
          </article>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </nav>
      )}

      {/* Role change confirmation */}
      <AlertDialog
        open={!!pendingChange}
        onOpenChange={(open) => {
          if (!open && !saving) setPendingChange(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingChange?.user.name} will change from{" "}
              <strong className="capitalize">{pendingChange?.user.role}</strong> to{" "}
              <strong className="capitalize">{pendingChange?.role}</strong>.
              {pendingChange?.role === "admin" && " Admins have full access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault(); // keep the dialog open until the request finishes
                confirmRoleChange();
              }}
            >
              {saving ? "Saving..." : "Yes, change role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban / unban confirmation */}
      <AlertDialog
        open={!!pendingBan}
        onOpenChange={(open) => {
          if (!open && !saving) setPendingBan(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingBan?.banned ? "Ban this user?" : "Unban this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingBan?.banned ? (
                <>
                  <strong>{pendingBan?.user.name}</strong> will no longer be able to use the
                  platform until an admin unbans them.
                </>
              ) : (
                <>
                  <strong>{pendingBan?.user.name}</strong> will be able to sign in and use the
                  platform again.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                confirmBanChange();
              }}
            >
              {saving
                ? "Saving..."
                : pendingBan?.banned
                  ? "Yes, ban user"
                  : "Yes, unban user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
