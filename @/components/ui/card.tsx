import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"

const cardRootVariants = cva("flex flex-col items-center rounded-lg cursor-pointer", {
  variants: {
    variant: {
      elevated: "shadow-lg ",
      filled: "bg-card",
      outlined: "border border-border",
    },
  },
  defaultVariants: {
    variant: "elevated",
  },
});

interface CardRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardRootVariants> {}

const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, children, variant, ...props }, ref) => {
    

    return (
      <div
        className={cn(
          cardRootVariants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardRoot.displayName = "Card.Root";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex h-72 items-center self-stretch", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "Card.Header";

const CardMedia = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex justify-center items-center flex-1 self-stretch select-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardMedia.displayName = "Card.Media";

const CardText = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex py-4 flex-col items-start gap-8 self-stretch px-3",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardText.displayName = "Card.Text";

const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Media: CardMedia,
  Text: CardText,
};

export { Card };
