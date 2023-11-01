"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Button,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

const NavBar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { setTheme, theme } = useTheme();

  return (
    <div className=" fixed left-0 right-0 top-0 z-30 mx-24 my-4 flex justify-between backdrop-blur-sm">
      <div className="flex cursor-pointer flex-row align-middle">
        <Link href="/">
          <Image
            width="60"
            height="60"
            src="https://res.cloudinary.com/dxmqknhgj/image/upload/v1688926766/kafka-nimbus-logo_lwqint.png"
            alt="logo"
            className="mr-2 h-8 w-8"
          />
        </Link>
        <div
          className="text-xl normal-case"
          // href="/"
          onClick={() => router.push("/")}
        >
          Kafka Nimbus
        </div>
      </div>

      {!sessionData ? (
        <Link
          href="./api/auth/signin?callbackUrl=/cluster-dashboard"
          className="overflow-hidden"
        >
          <Image
            width="35"
            height="35"
            alt="logo-not-logged-in"
            src={
              "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            }
          ></Image>
        </Link>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="https://github.com/oslabs-beta/Kafka-Nimbus"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">Clusters</NavigationMenuTrigger>
              <NavigationMenuContent className="">
                <ul className="grid gap-3 p-4  lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        {/* <Icons.logo className="h-6 w-6" /> */}
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Kafka Nimbus
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Serverless Message Broker stack.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/cluster-dashboard">Dashboard</ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                <Image
                  width="35"
                  height="35"
                  src={
                    sessionData?.user?.image ??
                    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Github-circle_%28CoreUI_Icons_v1.0.0%29.svg"
                  }
                  alt="profile-pic"
                  className="overflow-hidden rounded-full  hover:bg-slate-300"
                />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-lg">
                <ul className="grid gap-3 p-4  lg:grid-cols-[.75fr_1fr]">
                  <ListItem
                    onClick={() => {
                      void signOut({ callbackUrl: "/" });
                    }}
                  >
                    Logout
                  </ListItem>
                  <ListItem
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  >
                    {theme}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
};

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline decoration-transparent outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = "ListItem";

export default NavBar;
