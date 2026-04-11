"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export default function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              "transition-colors",
              filled ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300",
              interactive && "cursor-pointer hover:text-amber-400"
            )}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
