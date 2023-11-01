import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  Children,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import gsap from "gsap";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 rounded-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 rounded-md",
        outline: "text-foreground rounded-md border-2",
        round:
          "bg-primary text-primary-foreground rounded-full hover:bg-primary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// TODO: multiple badges animted in

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant }), className) }
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export interface BadgesProps extends HTMLAttributes<HTMLDivElement> {
  length: number;
  stagger?: number;
}

const Badges = forwardRef<HTMLDivElement, BadgesProps>(
  ({ children, className, length, stagger, ...props }, ref) => {
    const [opened, setOpened] = useState(false);
    const [shortened, setShortened] = useState<React.ReactNode[]>([]);
    const elements = useRef<HTMLDivElement[]>([]);
    const isFullLength: boolean = length === Children.toArray(children).length;
    const showLess: boolean = shortened.length <= length;

    const handleShowMore = (): void => {
      setShortened(Children.toArray(children));
      setOpened(true);
    };

    const handleShowLess = (): void => {
      const reactNodeArray = Children.toArray(children);
      if (reactNodeArray.length > length) {
        setShortened(reactNodeArray.slice(0, length));
      } else {
        setShortened(reactNodeArray);
      }
      setOpened(false)
    };

    useEffect(() => {
      const shortenChildren = (): void => {
        const reactNodeArray = Children.toArray(children);
        if (reactNodeArray.length > length) {
          setShortened(reactNodeArray.slice(0, length));
        } else {
          setShortened(reactNodeArray);
        }
        setOpened(false);
      };
      shortenChildren();
    }, [children, length]);

    useEffect(() => {
      const animateChildren = (): void => {
        const animations = gsap.timeline({
          defaults: {
            duration: stagger,
            scaleY: 0.1,
          },
        });
        elements.current.slice(length).forEach((element) => {
          animations.from(element, {
            opacity: 0,
            y: "+=15",
            ease: "circ",
          });
        });
      };
      if (opened) {
        animateChildren();
      }
    }, [opened]);

    return (
      <div
        {...props}
        className={cn("flex gap-1 flex-wrap", className)}
        ref={ref}
      >
        {shortened.map((node, index) => (
          <div
            key={index}
            ref={(el): void => (elements.current[index] = el as never)}
          >
            {node}
          </div>
        ))}
        {isFullLength ? null : (
          <Badge
            className="relative group pointer-events-auto"
            onClick={showLess ? handleShowMore : handleShowLess}
            variant="outline"
          >
            {!showLess ? (
              <>
                Show Less{" "}
                <ChevronUpIcon className="w-4 h-4 inline transform group-hover:rotate-180 transition duration-300" />
              </>
            ) : (
              <>
                Show More <ChevronDownIcon className="w-4 h-4 inline " />
              </>
            )}
          </Badge>
        )}
      </div>
    );
  }
);

Badges.displayName = "Badges";

export { Badge, Badges, badgeVariants };
