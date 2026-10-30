import type { ReactNode } from "react";
import { Card } from "./Card";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <Card className="flex flex-col items-center gap-3 py-12 text-center">
    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:size-6">
      {icon}
    </span>
    <h3 className="text-base font-semibold">{title}</h3>
    {description ? (
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    ) : null}
    {action}
  </Card>
);
