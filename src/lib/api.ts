export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";
export type ServiceCategory = "Hair" | "Skin" | "Nails" | "Makeup" | "Bridal";

export type SalonService = {
  _id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isActive: boolean;
};

export type CustomerAppointment = {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  message?: string;
  createdAt: string;
  service: SalonService;
};

export type CustomerSummary = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  blocked?: boolean;
};

export type AdminAppointment = CustomerAppointment & {
  customer: CustomerSummary;
};

export type AdminTransaction = {
  _id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string;
  createdAt: string;
  customer: CustomerSummary;
  service: Pick<SalonService, "name">;
  appointment: Pick<CustomerAppointment, "appointmentDate" | "timeSlot">;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the authentication service. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("Unable to authenticate with the appointment service.");
  }

  const body = await readJson(response);

  if (!isRecord(body) || typeof body.token !== "string") {
    throw new Error("The authentication response did not include an access token.");
  }

  return body.token;
}

async function requestApi<T>(
  path: string,
  options: RequestInit,
  authenticated: boolean,
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set NEXT_PUBLIC_API_URL to connect to the appointment service.");
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (authenticated) {
    headers.set("Authorization", `Bearer ${await getAccessToken()}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl.replace(/\/+$/, "")}${path}`, {
      ...options,
      headers,
      credentials: "omit",
    });
  } catch {
    throw new Error("Unable to reach the appointment service. Check your connection and try again.");
  }
  const body = await readJson(response);

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : `The appointment service returned an error (${response.status}).`;

    throw new Error(message);
  }

  if (!isRecord(body) || !("data" in body)) {
    throw new Error("The appointment service returned an unexpected response.");
  }

  return body.data as T;
}

export function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return requestApi<T>(path, options, true);
}

export function publicApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return requestApi<T>(path, options, false);
}
