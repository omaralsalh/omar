import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  link as linkStyles,
} from "@nextui-org/react";
import NextLink from "next/link";
import clsx from "clsx";

import UserAvatar from "../UserComponent/UserAvatar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/MainPageComponent/theme-switch";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <UserAvatar />
    </NextUINavbar>
  );
};
