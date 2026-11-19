"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  name,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="field pr-12"
          required
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-mocha/70 transition-colors hover:bg-sand hover:text-espresso"
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={1.6} />
          ) : (
            <Eye className="size-4" strokeWidth={1.6} />
          )}
        </button>
      </div>
    </div>
  );
}
