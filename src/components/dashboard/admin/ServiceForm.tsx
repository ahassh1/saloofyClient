"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { apiFetch, type SalonService } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/service-constants";

type ServiceFormProps = {
  serviceId?: string;
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 5 * 1024 * 1024;

export default function ServiceForm({ serviceId }: ServiceFormProps) {
  const router = useRouter();
  const editing = Boolean(serviceId);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    let ignore = false;

    async function loadService() {
      setLoading(true);
      setError(null);

      try {
        const services = await apiFetch<SalonService[]>("/api/admin/services");
        const service = services.find((item) => item._id === serviceId);

        if (!service) {
          throw new Error("This service could not be found.");
        }

        if (!ignore) {
          setName(service.name);
          setCategory(service.category);
          setDescription(service.description);
          setPrice(String(service.price));
          setDurationMinutes(String(service.durationMinutes));
          setImageUrl(service.imageUrl);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this service.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadService();
    return () => {
      ignore = true;
    };
  }, [serviceId]);

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageError(null);

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setImageError("Choose a JPG, PNG, or WebP image.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > maxImageSize) {
      setImageError("The image must be 5 MB or smaller.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    setImageFile(file);
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);
    const numericDuration = Number(durationMinutes);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      toast.error("Enter a price greater than zero.");
      return;
    }

    if (
      !Number.isInteger(numericDuration) ||
      numericDuration <= 0
    ) {
      toast.error("Duration must be a whole number greater than zero.");
      return;
    }

    if (!editing && !imageFile) {
      toast.error("Choose an image for this service.");
      return;
    }

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("category", category);
    formData.set("description", description.trim());
    formData.set("price", String(numericPrice));
    formData.set("durationMinutes", String(numericDuration));
    if (imageFile) formData.set("image", imageFile);

    setSaving(true);

    try {
      await apiFetch(
        editing
          ? `/api/admin/services/${encodeURIComponent(serviceId!)}`
          : "/api/admin/services",
        {
          method: editing ? "PATCH" : "POST",
          body: formData,
        },
      );
      toast.success(editing ? "Service updated." : "Service added.");
      router.push("/dashboard/admin/manage-services");
      router.refresh();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this service.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="mx-auto h-[36rem] w-full max-w-3xl animate-pulse rounded-2xl bg-sand/70"
        aria-label="Loading service"
      />
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/20 bg-cream p-5">
        <p className="font-medium">Unable to edit service</p>
        <p className="mt-1 text-sm text-mocha">{error}</p>
        <Link
          href="/dashboard/admin/manage-services"
          className="mt-4 inline-flex text-sm font-semibold underline decoration-gold underline-offset-4"
        >
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <header>
        <p className="eyebrow">Salon catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {editing ? "Edit service" : "Add a service"}
        </h1>
        <p className="mt-2 text-sm text-mocha">
          New services are active and available to customers by default.
        </p>
      </header>

      <form
        onSubmit={saveService}
        className="mt-8 space-y-5 rounded-2xl border border-line bg-cream p-5 shadow-sm sm:p-7"
      >
        <div>
          <label htmlFor="service-name" className="field-label">
            Service name
          </label>
          <input
            id="service-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
            required
          />
        </div>

        <div>
          <label htmlFor="service-category" className="field-label">
            Category
          </label>
          <select
            id="service-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof SERVICE_CATEGORIES)[number])
            }
            className="field"
            required
          >
            {SERVICE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service-description" className="field-label">
            Description
          </label>
          <textarea
            id="service-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="field resize-y"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="service-price" className="field-label">
              Price (USD)
            </label>
            <input
              id="service-price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="field"
              required
            />
          </div>
          <div>
            <label htmlFor="service-duration" className="field-label">
              Duration (minutes)
            </label>
            <input
              id="service-duration"
              type="number"
              min="1"
              step="1"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              className="field"
              required
            />
          </div>
        </div>

        {editing && imageUrl && (
          <div>
            <p className="field-label">Current image</p>
            <Image
              src={imageUrl}
              alt={`${name} service`}
              width={320}
              height={180}
              unoptimized
              className="h-44 w-full rounded-xl object-cover sm:w-80"
            />
          </div>
        )}

        <div>
          <label htmlFor="service-image" className="field-label">
            {editing ? "Replace image (optional)" : "Service image"}
          </label>
          <input
            id="service-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectImage}
            className="field file:mr-3 file:rounded-full file:border-0 file:bg-sand file:px-3 file:py-1 file:text-xs file:font-semibold"
            required={!editing}
          />
          {imageFile && (
            <p className="mt-2 text-xs text-mocha">
              Selected: {imageFile.name}
            </p>
          )}
          {imageError && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {imageError}
            </p>
          )}
          <p className="mt-2 text-xs text-mocha">
            JPG, PNG, or WebP; maximum 5 MB. Uploads are processed by the API.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-ivory hover:bg-mocha disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Add service"}
          </button>
          <Link
            href="/dashboard/admin/manage-services"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-6 text-sm font-semibold hover:bg-sand"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
