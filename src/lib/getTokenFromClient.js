import { toast } from "sonner";
import { authClient } from "./auth-client";
export const getTokenFromClient = async () => {
  try {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data?.token || null;
  } catch (err) {
    console.error("Error fetching token:", err);
    return null;
  }
};
let redirectingToSignIn = false;
async function handleExpiredSession() {
  if (redirectingToSignIn) return;
  redirectingToSignIn = true;
  try {
    await authClient.signOut();
  } catch {}
  toast.error("Your session has expired. Please sign in again.");
  // A full reload clears any stale client state; this module is not a component,
  // so the router hook is unavailable here.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/sign-in";
}

export async function authorizedFetch(url, options = {}) {
  const token = await getTokenFromClient();
  if (!token) {
    await handleExpiredSession();
    throw new Error("session-expired; sign-in in progress");
  }
  await storeTokenCookie(token);
  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    await handleExpiredSession();
    throw new Error("session-expired; sign-in in progress");
  }
  return res;
}
let cookieStored = false;
async function storeTokenCookie(token) {
  if (cookieStored) return;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        token
      })
    });
    if (res.ok) cookieStored = true;
  } catch (err) {
    console.error("Failed to store token cookie:", err);
  }
}
