<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SalonBook — Project Instructions & Progress

**Last updated:** 2026-11-27
**Current phase:** Phase 1 — client foundation and authentication (partially complete). The separate Express API exists and is being connected to the client.
**Current task status:** Stripe Checkout/webhook code and payment return pages are implemented; loading and error feedback have been improved. Focused client lint and server tests pass; full client lint/build remain blocked by pre-existing issues.

> Read this entire file before every task. This file is the single source of truth for scope, architecture, data rules, conventions, and progress. If a request conflicts with this file, stop and ask the user before proceeding.

---

## 1. Product overview

SalonBook is a salon appointment booking platform with two roles:

- **Customer (`user`):** browse active salon services, search by service name, filter by category, sort by price, view service details, book appointments, cancel their own pending appointments, pay for confirmed appointments with Stripe, view their appointments and payment history, and manage their profile.
- **Admin (`admin`):** manage salon services (create, update, delete, activate, deactivate), upload service images, view and manage all appointments, confirm or cancel appointments, view and manage customers (block/unblock), view transactions, and manage their own profile.

**Architecture**

| Layer | Technology | Location |
| --- | --- | --- |
| Client | Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/base-ui | `E:\saloofy` (this repository) |
| API | Express.js, JavaScript, REST | Separate existing repository at `E:\saloofyServer` |
| Database | MongoDB | Shared by client auth and Express API |
| Authentication | Better Auth (email/password + Google) | Better Auth lives in the Next.js app |
| Authorization | JWT verified by Express + role checks in Next.js | Client and server |
| Payments | Stripe Checkout + verified webhook | Express API |
| Image uploads | ImgBB API | Express API only |
| Toasts | `sonner` | Client |

**Important naming note:** the project brief calls the product **SalonBook**. The repository folder is `saloofy` and some existing UI copy says “Saloofy”. Do not perform a branding rename as part of an unrelated task. Align branding only when the user explicitly requests it.

---

## 2. Non-negotiable working rules

1. **Do not write or modify application code until the user explicitly requests a specific implementation step.** Creating or updating documentation is allowed.
2. **Do only the requested task.** Do not add features, dependencies, refactors, design changes, or unrelated fixes in the same step.
3. **Read this file and the relevant installed Next.js documentation before writing Next.js code.** The installed version is Next.js `16.4.6`, not an older version from training data.
   - Docs: `node_modules/next/dist/docs/`
   - Verify APIs and deprecation notices there before coding.
4. **Keep code beginner-friendly.** Prefer simple, readable functions and small components over clever abstractions. Comment non-obvious logic. Follow the existing structure, naming, theme, and patterns.
5. **Keep every secret in environment variables.** Never hard-code or commit secrets. `.env*` is already ignored by `.gitignore`; only commit `.env.example` files with placeholder values.
6. **Maintain separate client and server GitHub repositories** with meaningful commits and README files. Do not mix Express server code into the Next.js client repository.
7. **After every implementation step, update Section 16 of this file:** progress checklist, completed tasks, pending tasks, known issues, and next step.
8. **After every task, report:**
   - changed files,
   - three important code lines and why they matter,
   - exact manual testing instructions.
9. **Commit only when the user asks for a commit or the approved step explicitly includes repository maintenance.** Never commit `.env` files or secrets.
10. **Do not assume missing requirements.** If a business rule is ambiguous (for example refunds or global slot capacity), implement only what is written here and raise the question instead of inventing behavior.

---

## 3. Verified stack (as of 2026-11-22)

| Package | Installed version | Notes |
| --- | --- | --- |
| `next` | `16.4.6` | App Router; read bundled docs before coding |
| `react` / `react-dom` | `19.3.0` | React Compiler enabled |
| `typescript` | `^5` | Strict, type-safe code required |
| `tailwindcss` | `4.3.3` | CSS-first Tailwind v4 configuration |
| `better-auth` | `1.7.26` | Email/password, Google, JWT plugin |
| `@better-auth/mongo-adapter` | `1.7.26` | Supports `usePlural` and transactions |
| `mongodb` | `7.9.1` | Native driver |
| `shadcn` | `4.23.0` | UI components in `src/components/ui` |
| `@base-ui/react` | `1.9.0` | Base primitives used by UI components |
| `sonner` | `2.0.8` | Toast notifications |
| `lucide-react` | `1.76.0` | Icons |

**Installed client UI primitives:** button, badge, card, input, separator, sheet, sidebar, skeleton, sonner, tooltip. A confirmation dialog/alert-dialog is **not installed yet**; add it only in the step that needs confirmation dialogs, using the existing shadcn setup.

**Do not add dependencies without explicit user approval.**

---

## 4. Repositories and folder structure

### 4.1 Client repository (existing)

`E:\saloofy` — Next.js client.

```
src/
  app/
    (auth)/                  signin, signup, auth layout
    (dashboard)/             shared dashboard layout + sidebar
      dashboard/user/        customer pages
      dashboard/admin/       admin pages
    (root)/                  public site layout + home page
    api/auth/[...all]/       Better Auth Next.js handler
    globals.css
    layout.tsx
  components/
    auth/                    auth-specific inputs/marks
    dashboard/shared/        dashboard sidebar
    home/                    home page sections
    services/                service browsing components
    shared/                  header, navbar, footer, brand, user menu
    ui/                      shadcn/base-ui primitives
  hooks/
  lib/                       auth, auth client, utilities, date helpers
```

### 4.2 Server repository (existing)

Keep Express code in the separate `E:\saloofyServer` repository. Its current
route modules and direct MongoDB access should follow that repository's
`agent.md` conventions; do not move server code into this client repository.

```
src/
  config/           env validation, MongoDB connection
  middleware/       JWT auth, role guard, blocked-user guard, errors
  modules/
    services/       controller + validation + queries
    appointments/
    payments/       Stripe checkout, webhook, transaction writes
    users/          admin customer management
    transactions/   read-only history
  routes/           Express routers
  app.ts            Express app, CORS, JSON/raw-body setup
  server.ts         startup
```

The server must keep controllers thin, put database queries in small module files, and use one centralized error handler. Keep it beginner-friendly.

### 4.3 Git conventions

- Client commits: `feat(client): ...`, `fix(client): ...`, `docs(client): ...`, `chore(client): ...`
- Server commits: `feat(server): ...`, `fix(server): ...`, `docs(server): ...`, `chore(server): ...`
- Commit only a coherent, verified step.
- Each repository needs a README covering setup, environment variables, scripts, and how the client/server connect.

---

## 5. Roles and permissions matrix

| Capability | Guest | Customer (`user`) | Admin (`admin`) |
| --- | --- | --- | --- |
| View home, sign in, sign up | Yes | Yes | Yes |
| Browse/search/filter/sort active services | Yes | Yes | Yes |
| View active service details | Yes | Yes | Yes |
| Book an appointment | No | Yes | No |
| View own appointments | No | Yes | Yes (own only, if any) |
| Cancel own pending appointment | No | Yes | Yes (own only) |
| Pay for own confirmed appointment | No | Yes | Yes (own only) |
| View own payment history | No | Yes | Yes (own only) |
| Manage own profile | No | Yes | Yes |
| Create/update/delete services | No | No | Yes |
| Activate/deactivate services | No | No | Yes |
| Upload service images | No | No | Yes |
| View/manage all appointments | No | No | Yes |
| Confirm/cancel any appointment | No | No | Yes |
| View/block/unblock customers | No | No | Yes |
| View all transactions | No | No | Yes |
| Access admin dashboard | No | No | Yes |
| Access customer dashboard | No | Yes | No (redirect to admin dashboard) |

**Account rules**

- Public signup always creates a `user`. There is no admin signup option and no public endpoint that changes a role.
- Admin accounts are created/promoted only through a trusted server-side seed script or direct database action approved by the user.
- Never accept `role` or `blocked` from client input, request bodies, or query parameters.
- Only customers can be blocked/unblocked. Admins cannot be blocked through the customer-management UI, and an admin cannot block themselves.
- A blocked user must not be able to use protected features. Blocking should revoke active sessions where practical, but every protected API request must still re-check `blocked` in the database.

---

## 6. Authentication and authorization

### 6.1 Better Auth configuration

- Use the existing Better Auth setup in `src/lib/auth.ts` with the MongoDB adapter.
- Use `usePlural: true` so Better Auth stores users in the required `users` collection instead of the default singular collection name. Verify this against the installed adapter before changing it.
- Enable:
  - `emailAndPassword`
  - Google social provider
  - additional user field `role`: `"user" | "admin"`, default `"user"`, `input: false`
  - additional user field `blocked`: `boolean`, default `false`, `input: false`
- `input: false` prevents clients from setting these fields during signup/update. This is required to prevent privilege escalation.
- Add the Better Auth JWT plugin so Express can verify bearer tokens. Expose the JWKS endpoint at `/api/auth/jwks`.
- Include `role` in the JWT payload for convenience, but Express must still read the current role and blocked status from the database before authorizing.

### 6.2 Authentication flows

- **Email/password:** Better Auth signup and signin.
- **Google:** Better Auth social signin with the callback URL configured in Google Cloud Console.
- **Next.js pages:** use Better Auth session cookies through `authClient` and server-side `auth.api.getSession`.
- **Express API:** use `Authorization: Bearer <jwt>` obtained from the Better Auth JWT client (`authClient.token()`).
- On sign-out, clear the Better Auth session and return the user to the public site.

### 6.3 Express authorization middleware (planned)

Every protected Express route must run, in order:

1. Extract and validate the bearer token.
2. Verify the JWT signature using the Better Auth JWKS endpoint (`jose` remote JWKS is the planned approach).
3. Verify issuer/audience if configured.
4. Load the user from `users` by the JWT subject.
5. Reject missing users with `401`.
6. Reject blocked users with `403` and a stable error code such as `ACCOUNT_BLOCKED`.
7. Attach the authenticated user and role to the request.
8. Apply `requireRole("admin")` on admin routes and `requireRole("user")` on booking routes where specified.

**Authoritative source for role:** the `users.role` value in MongoDB. Never trust a role supplied in the request body, query string, or an unverified token.

**HTTP semantics**

- `401 Unauthorized` — missing, malformed, expired, or invalid token.
- `403 Forbidden` — authenticated but wrong role, or blocked account.
- `404 Not Found` — resource does not exist or is not visible to this user.
- `409 Conflict` — duplicate booking or invalid status transition.

### 6.4 Next.js dashboard guards

Implemented on the server in `src/lib/auth-guard.ts`:

- `getSessionUser()` reads the session with `auth.api.getSession({ headers })`. Better Auth loads the session and its user from MongoDB on every call, so `role` and `blocked` are always the current database values, never client-supplied.
- `requireAuthenticatedUser()` redirects guests to `/signin` and blocked users to `/blocked`.
- `requireDashboardRole(role)` additionally redirects a customer away from admin routes (to `/dashboard/user`) and an admin away from customer routes (to `/dashboard/admin`).
- The shared dashboard layout and both role layouts call these guards **before** rendering `children`. With Cache Components enabled, each guard sits behind a `<Suspense>` boundary and the segment exports `instant = false`.
- `/blocked` is a public-chrome notice page with a clear message and a sign-out action. It re-checks the session server-side and redirects anyone who is not blocked.
- `src/lib/api-auth.ts` exposes `requireApiUser()` and `requireApiAdmin()` for route handlers/server actions, returning `401 UNAUTHENTICATED`, `403 ACCOUNT_BLOCKED`, or `403 FORBIDDEN`.
- Do not rely on client-side hiding alone. Layout guards protect the client routes; the future Express API must still verify JWTs and re-check role/blocked per request (Section 6.3).

### 6.5 Public admin-registration prevention

- No admin choice in signup UI.
- Better Auth `role` is `input: false` and defaults to `user`.
- No Express endpoint accepts a role change.
- Admin routes require a verified admin role from the database.

---

## 7. Database model (canonical)

**Database name:** `saloofy` (already used by the current auth configuration).

**Collections**

The application uses four app-facing collections: `users` (Better Auth-owned), `services`, `appointments`, and `transactions`. Better Auth also owns framework collections for sessions, accounts, and verifications; those are not app data and must not be used to store salon records. Do not add extra collections.

**Conventions**

- MongoDB `_id` is an `ObjectId`; the API returns it as a string.
- References (`userId`, `serviceId`, `appointmentId`) are `ObjectId` values.
- Timestamps are `Date` values.
- Money is stored as integer **cents** in transactions; service prices are decimal USD numbers for display and are converted to cents for Stripe.
- Appointment date/time are salon-local wall-clock values, not UTC instants. Do not apply timezone conversion. See Known Issues for the open timezone policy.

### 7.1 `users` (Better Auth-owned)

```ts
{
  _id: ObjectId,
  name: string,
  email: string,                 // unique
  emailVerified: boolean,
  image?: string | null,
  role: "user" | "admin",        // default "user"; input: false
  blocked: boolean,              // default false; input: false
  createdAt: Date,
  updatedAt: Date,
}
```

- `role` and `blocked` are additional Better Auth fields.
- Never store passwords or tokens in app collections.
- Profile name/image updates go through Better Auth's `updateUser`; do not create a duplicate profile endpoint that bypasses Better Auth.

### 7.2 `services`

```ts
{
  _id: ObjectId,
  name: string,                  // trimmed, required
  description: string,           // required
  category: "Hair" | "Skin" | "Nails" | "Makeup" | "Bridal",
  price: number,                 // USD, > 0
  durationMinutes: number,       // integer, > 0
  imageUrl: string,              // ImgBB https URL, required
  imageDeleteUrl?: string,       // server-only, optional cleanup helper
  isActive: boolean,             // default true
  createdAt: Date,
  updatedAt: Date,
}
```

- Category values are a fixed constant shared by the API and UI. Changing them requires updating filters and validation together.
- Public service endpoints return only `isActive: true` services.
- Admin service endpoints return active and inactive services.
- `imageDeleteUrl` must never be exposed in public API responses.
- **Delete rule:** hard-delete a service only when no appointments reference it. If appointments exist, return `409` and instruct the admin to deactivate it instead. This keeps appointment history intact. Do not delete appointments to make a service deletable.
- Deactivation hides the service from public browsing but keeps it visible in admin lists.

### 7.3 `appointments`

```ts
{
  _id: ObjectId,
  userId: ObjectId,              // ref users._id
  serviceId: ObjectId,           // ref services._id
  appointmentDate: string,       // "YYYY-MM-DD"
  timeSlot: string,              // "HH:mm", 24-hour salon-local time
  status: "pending" | "confirmed" | "cancelled",
  paymentStatus: "unpaid" | "paid",
  createdAt: Date,
  updatedAt: Date,
}
```

- New appointments always start as `status: "pending"` and `paymentStatus: "unpaid"`; these values are forced by the server.
- Only three statuses exist. There is no `completed` status in this project. Do not add one without approval.
- Appointments are never hard-deleted; cancellation changes status.
- A paid appointment that is later cancelled keeps `paymentStatus: "paid"` until a refund feature is explicitly requested. Refunds are out of scope.

### 7.4 `transactions`

```ts
{
  _id: ObjectId,
  userId: ObjectId,              // ref users._id
  appointmentId: ObjectId,       // ref appointments._id; unique
  amount: number,                // integer cents
  currency: "usd",
  status: "paid",                // created only after a verified webhook
  stripeSessionId: string,       // unique
  stripePaymentIntentId?: string | null,
  createdAt: Date,
}
```

- A transaction is created only by the verified Stripe webhook flow.
- One appointment has at most one successful transaction.
- Transactions are read-only in the UI. No manual create/update/delete endpoints.
- There is no refund or refunded-status flow in scope.

### 7.5 Relationships

```
users 1 ─── N appointments
services 1 ─── N appointments
appointments 1 ─── 0..1 transactions
users 1 ─── N transactions
```

`transactions.userId` is intentionally stored for fast customer payment-history queries; it must always match the appointment owner.

### 7.6 Indexes

Create these with the server setup/seed step. Use a small script or documented migration, not ad-hoc edits.

```js
// users: Better Auth creates its own indexes; ensure unique email exists.
{ email: 1 } // unique

// services
{ isActive: 1, category: 1, price: 1 }
{ name: 1 }

// appointments
{ userId: 1, appointmentDate: 1, timeSlot: 1 } // unique, partial on active statuses
{ status: 1, appointmentDate: 1 }
{ userId: 1, createdAt: -1 }

// transactions
{ stripeSessionId: 1 } // unique
{ appointmentId: 1 }   // unique
{ userId: 1, createdAt: -1 }
{ createdAt: -1 }
```

**Duplicate-booking index:** the appointment index is unique on `{ userId, appointmentDate, timeSlot }` with a partial filter for active statuses (`pending` or `confirmed`). This enforces the duplicate rule under concurrency. A duplicate-key error (`E11000`) must be translated into `409 Conflict` with a friendly message. Cancelled appointments leave the partial index, so the customer can book that slot again.

---

## 8. Appointment rules

1. Only an authenticated user with role `user` can create an appointment. Admins manage appointments; they do not create bookings.
2. Blocked users cannot book, cancel, pay, or use any protected feature.
3. The service must exist and be `isActive: true`.
4. `appointmentDate` must be today or a future date in salon-local time. Past dates are rejected.
5. `timeSlot` must be a valid salon time slot. The final slot list will live in a shared server/client constant; do not hard-code different lists in multiple places.
6. The server sets `userId` from the verified JWT subject. Never accept a customer ID from the request body.
7. New appointments are forced to `pending` + `unpaid`.
8. Prevent duplicate active bookings for the same customer, date, and time slot. “Active” means `pending` or `confirmed`. Return `409` with a clear message if one exists.
9. Customers can cancel **only their own** appointment and **only while it is `pending`**.
10. Admins can confirm **only `pending`** appointments.
11. Admins can cancel **`pending` or `confirmed`** appointments.
12. Valid status transitions:
    - `pending` → `confirmed` (admin only)
    - `pending` → `cancelled` (owner or admin)
    - `confirmed` → `cancelled` (admin only)
    - `cancelled` is terminal.
13. Customers can list only their own appointments. Admins can list all appointments.
14. Do not allow customers to edit date, time, service, status, or payment status after booking. Rescheduling is not in scope.
15. Do not allow manual `paymentStatus` changes anywhere. It changes only through the verified payment flow.
16. Auto-expiry of pending appointments, waitlists, capacity limits, and global slot locking are **not** in scope unless requested.

---

## 9. Payment system (Stripe)

### 9.1 Checkout flow

1. The customer opens **My Appointments** and sees `Pay now` only for their own `confirmed` + `unpaid` appointment.
2. Client calls `POST /api/payments/checkout` with the appointment ID and a bearer JWT.
3. Express verifies the JWT, checks ownership, checks `status === "confirmed"`, checks `paymentStatus === "unpaid"`, and checks the user is not blocked.
4. Express loads the service price, converts USD to integer cents, and creates a Stripe Checkout Session with:
   - line item name/description from the service,
   - amount and currency,
   - `metadata.appointmentId` and `metadata.userId`,
   - success URL to the client Payment Success page,
   - cancel URL to the client Payment Cancel page.
5. Express returns the Checkout Session URL; the client redirects the browser to Stripe.
6. After payment, Stripe redirects to the success URL. The redirect alone does **not** prove payment.

### 9.2 Webhook flow

1. Stripe calls `POST /api/payments/webhook` on Express.
2. The webhook route must receive the **raw request body** for signature verification. Do not let a global JSON parser consume it.
3. Verify `stripe-signature` with `STRIPE_WEBHOOK_SECRET`. Reject invalid signatures with `400`.
4. Handle `checkout.session.completed` (and `checkout.session.async_payment_succeeded` if async payment methods are enabled).
5. Accept the event only when the session is paid (`payment_status === "paid"`).
6. Re-read the appointment from the database and verify:
   - it exists,
   - it is `confirmed`,
   - it is still `unpaid`,
   - metadata and amount/currency match the appointment/service.
7. In one MongoDB transaction/session:
   - set the appointment to `paymentStatus: "paid"`,
   - insert a `transactions` record with the Stripe session/payment-intent IDs.
8. If a transaction already exists for the session or appointment, return `200` and do nothing (idempotency).
9. If the appointment is already paid, return `200` and do nothing.
10. Never mark an appointment paid based on the browser redirect, a client request, a query parameter, or an admin action.

### 9.3 Security rules

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `IMGBB_API_KEY` stay server-side only.
- Never expose Stripe secret keys or ImgBB keys via `NEXT_PUBLIC_*`.
- Do not create an endpoint that sets `paymentStatus` or creates transactions manually.
- Do not trust amounts sent by the client; derive them from the database service price.
- Log webhook failures without logging secrets or full card data.
- Currency is USD (`usd`), stored as integer cents in transactions.

---

## 10. REST API plan

The client uses `NEXT_PUBLIC_API_URL` to reach Express. Better Auth endpoints remain under the Next.js app at `/api/auth/*`. All protected Express routes require a bearer JWT.

**Response shape**

- Success: `2xx` with `{ "data": ... }`
- Error: `4xx/5xx` with `{ "message": "Human-readable message", "code"?: "STABLE_CODE", "errors"?: { ... } }`

**Public**

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/services` | Active services; query: `search`, `category`, `sort=price_asc\|price_desc` |
| `GET` | `/api/services/:id` | Active service details |

**Customer**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/appointments` | Create a pending/unpaid booking |
| `GET` | `/api/appointments/my` | Own appointments |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel own pending appointment |
| `GET` | `/api/transactions/my` | Own payment history |
| `POST` | `/api/payments/checkout` | Create Stripe Checkout Session for own confirmed/unpaid appointment |
| `GET` | `/api/dashboard/user` | Derived customer overview stats |

**Admin**

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/services` | All services, active and inactive |
| `POST` | `/api/admin/services` | Create service; multipart image upload to ImgBB |
| `PATCH` | `/api/admin/services/:id` | Update service; optional new image |
| `DELETE` | `/api/admin/services/:id` | Delete only when unreferenced; otherwise `409` |
| `PATCH` | `/api/admin/services/:id/status` | Activate/deactivate |
| `GET` | `/api/admin/appointments` | All appointments; optional status/date filters |
| `PATCH` | `/api/admin/appointments/:id/confirm` | Confirm a pending appointment |
| `PATCH` | `/api/admin/appointments/:id/cancel` | Cancel a pending/confirmed appointment |
| `GET` | `/api/admin/users` | Customers; search by name/email |
| `PATCH` | `/api/admin/users/:id/block` | Block a customer |
| `PATCH` | `/api/admin/users/:id/unblock` | Unblock a customer |
| `GET` | `/api/admin/transactions` | All transactions |
| `GET` | `/api/admin/dashboard` | Derived admin overview stats |

**Stripe**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/payments/webhook` | Stripe webhook; raw body; no JWT |

**Rules**

- Validate every `:id` as a valid ObjectId before querying.
- Validate and normalize query parameters; reject unknown sort values.
- No pagination is required by the brief. Keep lists simple; if data volume becomes a problem, ask before adding pagination.
- CORS must allow only `CLIENT_URL` and the required methods/headers.
- Never return `imageDeleteUrl`, password hashes, tokens, or internal error stacks.

---

## 11. Pages, routes, and required behavior

### 11.1 Public

| Route | Status | Required behavior |
| --- | --- | --- |
| `/` | Existing UI | Professional salon landing page; links must work |
| `/services` | **Missing** (navbar link currently 404s) | Browse active services, search by name, category filter, price sort, loading/empty/error states |
| `/services/[id]` | **Missing** | Service details with image, category, price, duration, description, and a book action |
| `/payment/success` | Implemented | Explain payment is pending verified webhook confirmation; link to appointments |
| `/payment/cancel` | Implemented | Explain no payment was confirmed; link back to appointments |
| `/signin` | Existing UI + auth | Email/password and Google sign-in; links to signup |
| `/signup` | Existing UI + auth | Email/password and Google signup; no admin option; links to signin |

Public pages show only active services. Guests who try to book are sent to `/signin` and returned to the service afterward if practical.

### 11.2 Customer dashboard

| Route | Status | Required behavior |
| --- | --- | --- |
| `/dashboard/user` | Placeholder | Overview: upcoming appointments, pending count, paid count, recent activity, quick links |
| `/dashboard/user/my-appointments` | Implemented; API partial | Own appointments with service/date/status/payment, cancel pending, and pay confirmed/unpaid |
| `/dashboard/user/my-profile` | Placeholder | View/update name and image; show email and role; sign-out |

### 11.3 Admin dashboard

| Route | Status | Required behavior |
| --- | --- | --- |
| `/dashboard/admin` | Placeholder | Overview: service counts, appointment counts, customer count, paid revenue, recent appointments |
| `/dashboard/admin/manage-services` | Placeholder | Table/cards of all services; activate/deactivate; edit; delete with guard; loading/empty states |
| `/dashboard/admin/manage-services/add` | Placeholder | Create service form with ImgBB image upload; validation; success toast; redirect |
| `/dashboard/admin/manage-services/[id]/edit` | **Missing** | Update service form; optional image replacement |
| `/dashboard/admin/manage-appointments` | Placeholder | All appointments; filter; confirm pending; cancel pending/confirmed; confirmation dialogs |
| `/dashboard/admin/manage-users` | Placeholder | Customer list; search; block/unblock with confirmation; blocked badge |
| `/dashboard/admin/transactions` | Placeholder | Read-only payment history: customer, appointment/service, amount, date, Stripe reference |
| `/dashboard/admin/my-profile` | Placeholder | Admin profile view/update |

All dashboard routes use the separate responsive dashboard layout and role-based sidebar. The sidebar already defines most of these links; the add/edit service destination must match the actual routes.

---

## 12. UI/UX standards

**Visual direction**

- Salon-themed, professional, clean, warm, welcoming, and uncluttered.
- Reuse the existing palette: ivory, cream, sand, beige, line, espresso, mocha, gold, gold-soft, taupe.
- Reuse the existing fonts: Cormorant Garamond for display and Manrope for body.
- Reuse existing UI primitives; do not introduce a second design system.
- Avoid unnecessary animations. Keep any existing subtle transitions, and respect reduced-motion preferences where practical.

**Required states and feedback**

- Loading states: skeletons or spinners on every data-driven page and disabled submit buttons while pending.
- Error handling: inline messages for forms, toast notifications for action failures, and a friendly retry path for page-level failures.
- Empty states: clear copy and a useful next action (for example “Browse services”).
- Confirmation dialogs before destructive actions: cancel appointment, delete service, block user.
- Status badges:
  - `pending` — amber/warm attention
  - `confirmed` — emerald/success
  - `cancelled` — muted/red
  - `unpaid` — amber
  - `paid` — emerald
- Use `sonner` with explicit `toast.success` / `toast.error` for outcomes. Do not use the default neutral toast for errors.
- Format money as USD consistently (`Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`).
- Format dates consistently and make the date/slot unambiguous.

**Responsiveness and accessibility**

- Fully responsive on mobile, tablet, and desktop.
- Dashboard sidebar collapses to icons and uses the existing mobile sheet behavior.
- Tables become readable cards or horizontally scroll only as a last resort.
- Every input has a label; interactive controls are keyboard accessible; focus states remain visible.
- Icon-only buttons need `aria-label`.
- Avoid dead links, placeholder buttons, and links to nonexistent routes.

**Images**

- Service images come from ImgBB URLs. `next.config.ts` currently allows all HTTPS image hosts; once the ImgBB host is known, restrict `remotePatterns` to the required hosts as a hardening task.
- Uploads are server-side only. Validate file type and size before sending to ImgBB. If the upload fails, do not save the service with a broken image URL.

**Existing UI quality notes**

- Header social links appear to point to placeholder/personal accounts; replace only when the user provides correct links.
- The home page includes marketing sections; keep them consistent with the booking product and do not add features just to fill the page.

---

## 13. Environment variables

Never commit real values. Maintain `.env.example` files with placeholders.

### 13.1 Client (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `DB_URI` | MongoDB connection string used by Better Auth |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | Public client origin, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Express API base URL, e.g. `http://localhost:5000` |

**Google redirect URI:** `${BETTER_AUTH_URL}/api/auth/callback/google`.

### 13.2 Server (`.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port, e.g. `5000` |
| `DB_URI` | MongoDB connection string |
| `CLIENT_URL` | Allowed CORS origin, e.g. `http://localhost:3000` |
| `BETTER_AUTH_URL` | Better Auth origin, used to build the JWKS URL |
| `BETTER_AUTH_JWKS_URL` | Optional explicit JWKS URL; default `${BETTER_AUTH_URL}/api/auth/jwks` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `IMGBB_API_KEY` | ImgBB API key |

Never expose server secrets through `NEXT_PUBLIC_*` variables.

---

## 14. Coding conventions

- TypeScript everywhere; avoid `any` unless unavoidable and documented.
- Client components: add `"use client"` only where interactivity requires it. Keep public pages server-rendered where possible.
- Use one configured Better Auth client. The current file creates two clients; future work must export `signIn`, `signUp`, and `useSession` from the configured instance, not a second default instance.
- Protected dashboard data should be fetched with the bearer JWT through a small shared `apiFetch` helper; do not duplicate fetch/error handling in every page.
- Public GET endpoints may be fetched server-side.
- Validate request bodies and query parameters on the server with small reusable validator functions. Do not add a validation dependency without approval.
- Convert and validate ObjectIds before database operations.
- Use MongoDB transactions for the payment webhook’s appointment update + transaction insert.
- Centralize Express error handling; never leak stack traces.
- Keep controllers thin and database queries in small module functions.
- Comments should explain **why**, especially around authorization, duplicate-booking, and payment integrity. Keep them beginner-friendly.
- Remove temporary `console.log` debug statements before finishing a step. Never log secrets, tokens, or full payment data.
- Reuse existing components, theme tokens, and utility functions. Do not duplicate formatting or status-badge logic across pages.
- Follow the existing file naming around the code you touch; do not rename unrelated files.

---

## 15. Verification protocol

There is no automated test framework installed. Do not add one without approval. Verify each step with lint/build plus manual scenarios.

### 15.1 Every client step

1. `npm run lint`
2. `npm run build`
3. `npm run dev` and manually exercise the changed flow in a browser.
4. Confirm no new console errors and no dead links/buttons.
5. Check mobile width (around 375px) and desktop.

### 15.2 Every server step (once the server exists)

1. Server lint/build (using the scripts defined in that repository).
2. `GET /api/health`.
3. Test authenticated and unauthenticated requests.
4. Test `user` vs `admin` authorization and blocked users.
5. Verify database documents and indexes with `mongosh`.

### 15.3 Payment step

1. Run the Stripe CLI listener:
   `stripe listen --forward-to localhost:5000/api/payments/webhook`
2. Use Stripe test card `4242 4242 4242 4242`.
3. Confirm the appointment becomes `paid` and exactly one transaction is created.
4. Replay the webhook and confirm idempotency (still exactly one transaction).
5. Confirm the success redirect alone never marks an appointment paid.
6. Confirm a customer cannot pay another customer’s appointment or an unconfirmed appointment.

### 15.4 Required report format after each task

````md
## Changed files
- ...

## Three important lines
1. `...` — why it matters.
2. `...` — why it matters.
3. `...` — why it matters.

## Manual testing
1. ...
2. ...
````

Then update Section 16 of this file.

---

## 16. Progress tracker

**Legend:** ✅ complete · 🟡 partial/placeholder · ⬜ not started · ⚠️ known issue

**Snapshot date:** 2026-11-27
**Latest commit:** `fbf6a1d` — “part-2: added role base dashboard navigatation & hidration, hooks ihssue resolved”
**Uncommitted changes:** Stripe Checkout/webhook routes and clearer upload/checkout errors in `E:\saloofyServer`, client payment return/error feedback, and related appointment/API/documentation updates.

### 16.1 Completed

- ✅ Next.js 16.4.6 client scaffold with TypeScript and Tailwind CSS v4.
- ✅ Salon theme tokens, fonts, metadata, grain overlay, and global toaster.
- ✅ Public shell: Header, Navbar, Footer, Brand, session-aware UserMenu.
- ✅ Home page sections: Hero, Review, Download.
- ✅ Better Auth server setup with MongoDB adapter, email/password, Google provider, and role additional field.
- ✅ Better Auth Next.js route handler at `/api/auth/[...all]`.
- ✅ Sign-in page UI with email/password + Google and loading state.
- ✅ Sign-up page UI with email/password + Google, password hints, and profile-image UI.
- ✅ Session-aware navbar and sign-out flow.
- ✅ Separate dashboard layout with responsive collapsible sidebar.
- ✅ Role-based sidebar navigation for customer and admin roles.
- ✅ Placeholder routes for customer dashboard, appointments, profile, and all admin dashboard pages.
- ✅ `.gitignore` excludes `.env*`, build output, and TypeScript build info.
- ✅ Canonical `AGENTS.md` created (this file).
- ✅ `blocked` additional Better Auth field (`boolean`, `input: false`, default `false`).
- ✅ Single configured Better Auth client; `signIn`, `signUp`, `signOut`, and `useSession` share it.
- ✅ Server-side dashboard guards in `src/lib/auth-guard.ts` (authentication, blocked account, role).
- ✅ Role layouts for `/dashboard/user` and `/dashboard/admin` with server-side role redirects.
- ✅ `/blocked` notice page with a server-side session re-check and sign-out action.
- ✅ Reusable `requireApiUser()` / `requireApiAdmin()` guards for future route handlers.
- ✅ Fixed the pre-existing `Download.tsx` invalid `buttonVariants({ variant: "light" })` type error that blocked `next build` (now `outline`).
- ✅ Added Stripe Checkout and webhook routes in `E:\saloofyServer`; only a verified paid webhook records a transaction and marks the appointment paid.
- ✅ Added customer appointment listing compatibility for the client and payment success/cancel return pages.
- ✅ Added a branded 404 page, clearer API connection/response errors, explicit signup toasts, and client-compatible appointment input names.

### 16.2 In progress / partial

- 🟡 Dashboard sidebar refinement (uncommitted `DashboardSidebar.tsx` change).
- 🟡 Dashboard pages render placeholders only; no real data.
- 🟡 Service browsing component is a placeholder (`src/components/services/service-browser.tsx`).
- 🟡 Authentication flows work, but sign-in/sign-up feedback and logging still need cleanup (see known issues).
- 🟡 Role guards run per layout, not on every client navigation inside the same role area; future data access must re-verify the session (DAL pattern).
- 🟡 Customer appointment payment flow is wired to the existing Express API; broader appointment actions still need endpoint compatibility checks.
- 🟡 Labeled loading states are present for service fetching, customer dashboard/appointment data, booking submissions, and checkout; admin dashboard loading remains unverified because its source file contains NUL bytes.
- 🟡 API error feedback now handles network/non-JSON responses; server upload and Stripe Checkout failures return clearer errors. Focused client lint and server tests pass, but full lint/build and browser checks remain blocked or pending.
- 🟡 Admin service form now uses the server's separate image-upload endpoint and JSON create/update routes; inactive-service editing and the full admin service-management API remain incomplete.
- 🟡 Customer dashboard overview and profile form are implemented; lint/build and browser validation are still pending.
- 🟡 Better Auth JWT plugin is configured for the planned Express API; runtime token issuance has not been verified.

### 16.3 Pending

**Stabilization (before or alongside new features)**

- ⬜ Verify Google OAuth redirect URI and environment variables.
- ⬜ Resolve brand naming (“Saloofy” vs “SalonBook”) when approved.

**Server foundation**

- ✅ Separate Express server repository exists with README and `.env.example`.
- ✅ Server environment validation, MongoDB connection, CORS, JSON parsing, error handler, and `/api/health` exist.
- ✅ Client Better Auth JWT plugin/JWKS configuration exists.
- ✅ Express JWT verification, user loading, role guard, and blocked-user checks exist.
- 🟡 Collections/indexes and `promote-admin` exist; verify complete alignment with the canonical data model.

**Services**

- 🟡 Current API supports basic service listing, image upload, and create/update; search/filter/sort, admin listing, delete, and status toggle remain.
- 🟡 ImgBB upload validation and API failure handling are implemented; live provider verification remains.
- ⬜ Public `/services` page wired to the API.
- ⬜ Service details page and booking entry point.
- ⬜ Admin manage-services page with real data.
- 🟡 Admin add/edit form is wired to the current create/update/upload endpoints; inactive-service editing and browser validation remain.

**Appointments and users**

- ⬜ Appointment creation API with all validation, duplicate protection, and server-forced statuses.
- 🟡 Customer appointment list is connected; add/align the pending-cancellation endpoint.
- ⬜ Admin appointments page: list, filter, confirm, cancel.
- ⬜ Admin users page: list, search, block/unblock.
- ⬜ Admin profile page with Better Auth profile updates.
- ⬜ Customer and admin dashboard overview data.

**Payments**

- 🟡 Stripe Checkout Session endpoint and verified webhook implemented; unit/API tests pass, but live Stripe + MongoDB transaction testing remains.
- ⬜ Customer payment history page.
- ⬜ Admin transactions page.
- ⬜ End-to-end payment testing with Stripe CLI.

**Quality and delivery**

- ⬜ Resolve existing NUL-byte client files, then pass lint/build and manually verify the payment return pages.
- ⬜ Manually verify the 404, signup errors, booking conflict, image-upload failure, and Stripe Checkout failure feedback.
- 🟡 Loading feedback added for services, customer dashboard/appointments, booking, and checkout; remaining dashboard states and confirmation dialogs still need implementation.
- ⬜ Full responsive and accessibility pass.
- ⬜ Remove debug logs and placeholder copy.
- ⬜ Restrict `next.config.ts` remote image hosts once ImgBB is configured.
- ⬜ Client README and server README with setup/testing instructions.
- ⬜ Meaningful commits in both repositories (only when requested/approved).

### 16.4 Known issues

**High priority**

1. ⚠️ **Server/client API coverage is incomplete.** `E:\saloofyServer` exists and now supports Stripe Checkout, but several client/admin routes remain unimplemented. Service listing/status/delete management and editing inactive services are not supported by the current API.
2. ⚠️ **`/services` is a dead link.** The navbar links to `/services`, but no route exists. The service browser component is still a placeholder.

**Medium priority**

4. ⚠️ **Branding inconsistency.** The brief says SalonBook; the folder and some UI say “Saloofy”. Decide before final polish.
5. ⚠️ **Sign-in feedback/logging remains unverified.** Its source file contains NUL bytes and must be repaired before it can be reviewed or validated.
7. ⚠️ **Profile-image upload UI is non-functional.** Sign-up shows upload/URL controls, but only the URL path is sent; no ImgBB upload exists.
8. ⚠️ **No confirmation dialog primitive installed.** Required destructive-action dialogs will need the shadcn alert-dialog component when that step is approved.
9. ⚠️ **Existing uncommitted sidebar change.** `DashboardSidebar.tsx` was modified before the protected-routes task. Review it before editing that file.
10. ⚠️ **Admin dashboard pages remain placeholders** and show static text. Customer appointment list/payment are connected, but other actions remain partial.
11. ⚠️ **Blocked users can still sign in.** They are redirected to `/blocked` and cannot use dashboards, but no Better Auth hook revokes their sessions yet; blocking must also be enforced by every future API call.

**Policy/scope questions (do not invent behavior)**

12. ⚠️ **Timezone policy:** dates/slots are documented as salon-local wall-clock values. Confirm the salon’s timezone before implementing reminders or UTC storage.
13. ⚠️ **Refunds:** cancelling a paid appointment leaves it `paid`; refund behavior is not implemented and is out of scope until requested.
14. ⚠️ **Global slot capacity:** the brief only requires preventing duplicate active bookings for the same date/time slot; it does not define whether the salon can serve multiple customers in one slot. The current rule is per-customer. Confirm before adding capacity logic.
15. ⚠️ **Service deletion with history:** hard deletion is blocked when appointments reference the service; admins are directed to deactivate. Confirm this interpretation if a strict hard-delete is required.
16. ⚠️ **Unsplash/placeholder content:** home and auth pages use stock imagery and placeholder social links. Replace only with approved assets.
17. ⚠️ **Existing client source files contain NUL bytes.** This causes current lint/build parsing failures in unrelated pages; they were not modified as part of payment work.

### 16.5 Next step

Run a real Stripe test-mode checkout with MongoDB running as a replica set, then replay the webhook and confirm one transaction is created. After that, continue aligning remaining customer/admin client actions with `E:\saloofyServer`.

---

## 17. Documentation update protocol

After every implementation step, update Section 16 as follows:

1. Move finished items from Pending to Completed.
2. Mark partial work as In progress with a precise description.
3. Add or remove Known Issues honestly.
4. Update the snapshot date and latest commit when applicable.
5. Write the next concrete step.
6. Keep the rest of this document accurate if a rule, route, field, or environment variable changes.

Do not mark a task complete unless lint/build and the relevant manual checks pass.
