"use client";

import { useEffect, useState } from "react";

import { apiFetch, type CustomerAppointment } from "@/lib/api";

export function useCustomerAppointments() {
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadAppointments() {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<CustomerAppointment[]>(
          "/api/appointments/my",
        );

        if (!Array.isArray(result)) {
          throw new Error("The appointment service returned an unexpected list.");
        }

        if (!ignore) setAppointments(result);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your appointments.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadAppointments();

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  return {
    appointments,
    loading,
    error,
    reload: () => setReloadCount((count) => count + 1),
  };
}
