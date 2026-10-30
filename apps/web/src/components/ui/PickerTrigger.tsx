import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName } from "./field-styles";

type PickerTriggerProps = ComponentPropsWithRef<"button"> & {
  icon: ReactNode;
  placeholder: string;
  label: string | null;
};

/** Button that looks exactly like our text inputs, for pickers that open a popover instead of typing. */
export const PickerTrigger = ({
  icon,
  placeholder,
  label,
  className,
  ...props
}: PickerTriggerProps) => (
  <button
    type="button"
    className={cn(
      fieldClassName,
      "flex h-11 cursor-pointer items-center gap-2.5 text-left data-[state=open]:border-primary",
      className,
    )}
    {...props}
  >
    <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
    <span className={cn("flex-1 truncate", !label && "text-muted-foreground")}>
      {label ?? placeholder}
    </span>
  </button>
);
