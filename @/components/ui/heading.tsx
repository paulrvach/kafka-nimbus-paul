import { type HTMLAttributes, forwardRef } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"

type HeadingRootProps = HTMLAttributes<HTMLDivElement>;

const HeadingRoot = forwardRef<HTMLDivElement, HeadingRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
        <div
          className={cn("flex gap-4 w-full p-3 items-center", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
    );
  }
);

HeadingRoot.displayName = "Heading.Root";

const headingAvatarVariants = cva(
  "rounded-lg select-none items-start justify-start overflow-hidden flex-none bg-secondary rounded-radius",
  {
    variants: {
      size: {
        sm: "h-[48px] w-[48px]",
        md: "h-[64px] w-[64px]",
        lg: "h-[96px] w-[96px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface HeadingIconAvatar
  extends Avatar.AvatarProps,
    VariantProps<typeof headingAvatarVariants> {
  src?: string;
  fallback: string;
  alt?: string;
}

const HeadingAvatar = forwardRef<HTMLDivElement, HeadingIconAvatar>(
  (
    { alt, className, children, asChild, src, fallback, size, ...props },
    ref
  ) => {
    return (
      <Avatar.Root
        className={cn(headingAvatarVariants({ size }), className as string)}
        ref={ref}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <Avatar.Image
            alt={alt}
            className="h-full w-full rounded-[inherit] object-cover"
            src={src}
          />
        )}
        <Avatar.Fallback
          className="text-primary leading-1 flex h-full w-full font-medium items-center justify-center rounded-[inherit]"
          delayMs={600}
        >
          {fallback}
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }
);

HeadingAvatar.displayName = "Heading.Icon";

interface HeadingHeadlinesProps extends HTMLAttributes<HTMLDivElement> {
  headline: string;
  subhead?: string;
  supporting?: string;
}


const HeadingHeadlines = forwardRef<HTMLDivElement, HeadingHeadlinesProps>(
  ({ className, headline, subhead, supporting, ...props }, ref) => {
    return (
      <div
        className={cn("w-full flex flex-col gap-8 flex-wrap grow", className)}
        ref={ref}
        {...props}
      >
        <div className="flex flex-col justify-around h-full w-full">
          <h2 className="text-lg font-semibold">{headline}</h2>
          {subhead ? <p className="">{subhead}</p> : null}
        </div>
        {supporting ? <p>{supporting}</p> : null}
      </div>
    );
  }
);

HeadingHeadlines.displayName = "Heading.Headers";

const Heading = {
  Root: HeadingRoot,
  Avatar: HeadingAvatar,
  Headlines: HeadingHeadlines,
};

export {
  
  //
  Heading
};
