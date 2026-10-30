import { cva, type VariantProps } from "class-variance-authority";

// Shared by <Button> and by links styled as buttons, so a CTA looks the same whether it navigates or submits.
export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-[transform,opacity,background-color,color] duration-200 ease-out-strong select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "glass-btn text-primary-foreground hover:brightness-110",
        secondary: "glass-btn-secondary text-foreground hover:bg-card-hover",
        outline:
          "rounded-full border border-input-border bg-transparent text-foreground hover:bg-card-hover",
        ghost: "rounded-full text-foreground hover:bg-card-hover",
        danger:
          "rounded-full bg-destructive text-destructive-foreground hover:brightness-110",
        link: "rounded-md px-0! text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
