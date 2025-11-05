import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base styles
        "aspect-square size-5 shrink-0 rounded-full border-2 shadow-xs transition-all duration-200 outline-none",

        // Light mode - enhanced contrast
        "border-gray-400 bg-white text-gray-900",
        "hover:border-gray-600 hover:bg-gray-50",
        "focus-visible:border-gray-800 focus-visible:ring-4 focus-visible:ring-gray-200",
        "data-[state=checked]:border-brand data-[state=checked]:bg-brand",

        // Dark mode
        "dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100",
        "dark:hover:border-gray-400 dark:hover:bg-gray-700",
        "dark:focus-visible:border-gray-300 dark:focus-visible:ring-4 dark:focus-visible:ring-gray-600",
        "dark:data-[state=checked]:border-brand dark:data-[state=checked]:bg-brand",

        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:border-gray-300 disabled:bg-gray-100",
        "dark:disabled:border-gray-600 dark:disabled:bg-gray-800",

        // Invalid states
        "aria-invalid:border-red-500 aria-invalid:bg-red-50",
        "dark:aria-invalid:border-red-400 dark:aria-invalid:bg-red-900/20",
        "aria-invalid:focus-visible:ring-red-100 dark:aria-invalid:focus-visible:ring-red-900/30",

        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-white absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
