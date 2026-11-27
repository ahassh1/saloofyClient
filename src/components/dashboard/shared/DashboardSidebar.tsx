
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  LayoutDashboard,
  PanelLeftClose,
  PlusCircle,
  Receipt,
  Scissors,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// Define supported user roles.
type UserRole = "user" | "admin";

// Define sidebar item structure.
type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

// Receive the role from the server layout.
type DashboardSidebarProps = {
  role: UserRole;
};

// Define navigation items for each role.
const roleBasedSidebarItems: Record<UserRole, NavItem[]> = {
  user: [
    {
      title: "Overview",
      href: "/dashboard/user",
      icon: LayoutDashboard,
    },
    {
      title: "My Appointments",
      href: "/dashboard/user/my-appointments",
      icon: CalendarDays,
    },
    {
      title: "My Profile",
      href: "/dashboard/user/my-profile",
      icon: UserRound,
    },
  ],

  admin: [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Services",
      href: "/dashboard/admin/manage-services",
      icon: Scissors,
    },
    {
      title: "Add/Update Service",
      href: "/dashboard/admin/manage-services/add",
      icon: PlusCircle,
    },
    {
      title: "Manage Appointments",
      href: "/dashboard/admin/manage-appointments",
      icon: CalendarDays,
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/manage-users",
      icon: Users,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/my-profile",
      icon: UserRound,
    },
  ], 
};

// Keep navigation styles consistent.
const navItemClass =
  "h-11 gap-3 rounded-xl px-3 text-[0.82rem] font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-gold data-active:font-semibold data-active:text-espresso data-active:hover:bg-gold data-active:hover:text-espresso";

const footerItemClass =
  "h-10 gap-3 rounded-xl px-3 text-[0.8rem] font-medium text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground";

export default function DashboardSidebar({
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  // Get navigation items based on the user role.
  const sidebarItems = roleBasedSidebarItems[role];

  // Highlight the most specific route that matches the current path.
  const activeHref = sidebarItems
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        {/* Brand section */}
        <SidebarHeader className="gap-0 p-0">
          <div className="flex items-center px-5 py-6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
            > 
              {/* Brand icon */}
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                <span className="size-2.5 rotate-45 bg-gold" />
              </span>

              {/* Brand name */}
              <span className="truncate font-display text-2xl leading-none tracking-tight group-data-[collapsible=icon]:hidden">
                Saloo<span className="text-gold">fy</span>
              </span>
            </Link>
        </div>

          {/* Dashboard heading */}
          <div className="px-5 pt-6 pb-2 group-data-[collapsible=icon]:hidden">
            <h2 className="font-display text-[2rem] leading-none font-semibold tracking-tight">
              Dashboard
            </h2>

            <p className="mt-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold/70">
              Manage Workspace
            </p>
          </div>
        </SidebarHeader>

        {/* Role-based navigation */}
        <SidebarContent className="px-3 pt-2 group-data-[collapsible=icon]:px-1.5">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {sidebarItems.map(({ title, href, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={activeHref === href}
                      tooltip={title}
                      className={navItemClass}
                    >
                      {/* Navigation icon */}
                      <Icon strokeWidth={1.8} />

                      {/* Navigation label */}
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar footer actions */}
        <SidebarFooter className="gap-0 border-t border-sidebar-border p-0">
          <SidebarMenu className="gap-1.5 p-3 group-data-[collapsible=icon]:p-1.5">
            {/* Return to main website */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                tooltip="Back to site"
                className={footerItemClass}
              >
                <ArrowLeft strokeWidth={1.8} />
                <span>Back to site</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Toggle sidebar visibility */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                tooltip="Collapse sidebar"
                className={footerItemClass}
              >
                <PanelLeftClose strokeWidth={1.8} />
                <span>Collapse sidebar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {/* Sidebar collapse rail */}
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}