import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

type FormMessageProps = { tone: "error" | "success"; children: string };

export const FormMessage = ({ tone, children }: FormMessageProps) => (
  <p
    role={tone === "error" ? "alert" : "status"}
    className={cn(
      "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm",
      tone === "error"
        ? "bg-destructive/10 text-destructive"
        : "bg-success/10 text-success",
    )}
  >
    {tone === "error" ? (
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
    ) : (
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
    )}
    {children}
  </p>
);
