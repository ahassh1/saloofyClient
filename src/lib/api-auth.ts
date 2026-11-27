import { NextResponse } from "next/server";

import { getSessionUser, type SessionUser } from "./auth-guard";

// Either the authenticated user, or a ready-to-return error response.
export type ApiAuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

// Shared error bodies keep API responses consistent with AGENTS.md section 10.
function errorResponse(
  status: 401 | 403,
  message: string,
  code: string,
): NextResponse {
  return NextResponse.json({ message, code }, { status });
}

/**
 * Server-side authorization for route handlers and server actions.
 *
 * Always call this before touching protected data. Never trust a role sent in
 * the request body or query string.
 */
export async function requireApiUser(): Promise<ApiAuthResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      response: errorResponse(
        401,
        "Authentication required.",
        "UNAUTHENTICATED",
      ),
    };
  }

  if (user.blocked) {
    return {
      ok: false,
      response: errorResponse(
        403,
        "Your account has been blocked. Please contact the salon.",
        "ACCOUNT_BLOCKED",
      ),
    };
  }

  return { ok: true, user };
}

/**
 * Same as `requireApiUser`, but also requires the admin role.
 * Use on every admin-only endpoint.
 */
export async function requireApiAdmin(): Promise<ApiAuthResult> {
  const result = await requireApiUser();

  if (!result.ok) return result;

  if (result.user.role !== "admin") {
    return {
      ok: false,
      response: errorResponse(403, "Admin access required.", "FORBIDDEN"),
    };
  }

  return result;
}
