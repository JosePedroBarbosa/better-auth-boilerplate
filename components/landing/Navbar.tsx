"use client";
import React from "react";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { logoConfig, menuItems, authConfig } from "@/constants/index";
import Link from "next/link";

// Icon mapping
const iconMap = {
  Book: Book,
  Trees: Trees,
  Sunset: Sunset,
  Zap: Zap,
};

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  iconName?: keyof typeof iconMap;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = logoConfig,
  menu = menuItems,
  auth = authConfig,
}: Navbar1Props) => {
   const { data: session, isPending } = authClient.useSession();

  // Process menu items to add icons
  const processedMenu = menu.map(item => ({
    ...item,
    items: item.items?.map(subItem => ({
      ...subItem,
      icon: subItem.iconName ? 
        React.createElement(iconMap[subItem.iconName], { className: "size-5 shrink-0" }) : 
        subItem.icon
    }))
  }));
  return (
    <section className="sticky top-0 z-50 py-2.5 border-b backdrop-blur-xl backdrop-saturate-200 shadow-xl transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="w-9 h-9 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter text-foreground">
                {logo.title}
              </span>
            </Link>
          </div>
          
          {/* Centered Navigation Menu */}
          <div className="flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                {processedMenu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex gap-3 items-center">
            {isPending ? null : session ? (
              <Button variant="outline" asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button variant="blue" asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="w-10 h-10 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter text-foreground">
                {logo.title}
              </span>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto backdrop-blur-md text-foreground">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        className="w-10 h-10 dark:invert"
                        alt={logo.alt}
                      />
                      <span className="text-lg font-semibold tracking-tighter text-foreground">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {processedMenu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {isPending ? null : session ? (
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button variant="blue" asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="backdrop-blur-md text-foreground min-w-[320px] border border-border shadow-lg rounded-md">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-foreground/5 hover:text-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };