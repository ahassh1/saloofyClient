import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export type UserRole = "user" | "admin";

// Narrow, serializable user shape for the server. Only what the UI needs.
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  blocked: boolean;
};

/**
 * Read the signed-in user on the server.
 *
 * Better Auth loads the session AND its user from MongoDB on every call, so
 * `role` and `blocked` are always the current database values. They are never
 * read from the browser, which is what makes this safe for authorization.
 *
 * This module must only be imported by server code (layouts, pages, route
 * handlers). Client components use `authClient.useSession()` for display only.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    // Unknown/missing roles fall back to the least privileged role.
    role: session.user.role === "admin" ? "admin" : "user",
    blocked: session.user.blocked === true,
  };
}

/**
 * Guard shared by every dashboard route.
 *
 * - Unauthenticated visitors are sent to sign in.
 * - Blocked accounts are sent to the blocked notice page.
 */
export async function requireAuthenticatedUser(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) redirect("/signin");
  if (user.blocked) redirect("/blocked");

  return user;
}

/**
 * Guard for a role-specific dashboard section.
 *
 * A customer cannot open admin routes and an admin cannot open customer
 * routes: each is redirected to their own dashboard. This check runs on the
 * server, so hiding sidebar links is not what protects the routes.
 */
export async function requireDashboardRole(
  requiredRole: UserRole,
): Promise<SessionUser> {
  const user = await requireAuthenticatedUser();

  if (user.role !== requiredRole) {
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}
