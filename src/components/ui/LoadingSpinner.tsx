import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullPage?: boolean;
}

const sizeMap = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

export default function LoadingSpinner({
  size = "md",
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600",
        sizeMap[size],
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
