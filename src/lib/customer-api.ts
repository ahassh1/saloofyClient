export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export type CustomerAppointment = {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  service: {
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    description?: string;
    durationMinutes?: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch("/api/auth/token", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with the appointment service.");
  }

  const body: unknown = await response.json();

  if (!isRecord(body) || typeof body.token !== "string") {
    throw new Error("The authentication response did not include an access token.");
  }

  return body.token;
}

export async function customerApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set NEXT_PUBLIC_API_URL to connect to the appointment service.");
  }

  const token = await getAccessToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${apiUrl.replace(/\/+$/, "")}${path}`,
    {
      ...options,
      headers,
      credentials: "omit",
    },
  );
  const body: unknown = await response.json();

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
