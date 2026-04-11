"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// In React 19, ref is a regular prop — no need for forwardRef.
export default function Input({
  className,
  label,
  error,
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          "placeholder:text-slate-400",
          "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
