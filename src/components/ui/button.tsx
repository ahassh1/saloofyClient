import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full border border-transparent text-[0.68rem] font-semibold uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-gold focus-visible:ring-4 focus-visible:ring-gold/25 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-espresso text-ivory hover:bg-gold hover:text-espresso",
        gold: "bg-gold text-espresso hover:bg-espresso hover:text-ivory",
        outline:
          "border-espresso/20 bg-transparent text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory",
        light:
          "border-ivory/25 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-espresso",
        secondary:
          "bg-beige text-espresso hover:bg-gold-soft",
        ghost: "text-espresso hover:bg-espresso/[0.06]",
        link: "text-espresso underline-offset-4 hover:text-gold hover:underline",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5 text-[0.62rem]",
        lg: "h-14 px-9",
        icon: "size-11 rounded-full",
        "icon-sm": "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
