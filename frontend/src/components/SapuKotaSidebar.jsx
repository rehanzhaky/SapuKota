import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  UsersIcon,
  BarChartIcon,
  LogOutIcon,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import sapuLogo from "../assets/sapu.png"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const { user, logout, isPetugas } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Different navigation menus based on role
  const getNavMain = () => {
    if (isPetugas) {
      return [
        {
          title: "Dashboard",
          url: "/petugas/dashboard",
          icon: LayoutDashboardIcon,
          isActive: location.pathname === "/petugas/dashboard",
        },
      ]
    }
    
    // Admin menu
    return [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboardIcon,
        isActive: location.pathname === "/admin/dashboard",
      },
      {
        title: "Kelola Laporan",
        url: "/admin/laporan",
        icon: ClipboardListIcon,
        isActive: location.pathname === "/admin/laporan",
      },
      {
        title: "Kelola Petugas",
        url: "/admin/petugas",
        icon: UsersIcon,
        isActive: location.pathname === "/admin/petugas",
      },
    ]
  }

  const data = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@sapukota.com",
      avatar: null,
    },
    navMain: getNavMain(),
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild={!isPetugas}>
              {isPetugas ? (
                <div className="flex items-center gap-2 cursor-default">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img src={sapuLogo} alt="SapuKota" className="size-6" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">SapuKota</span>
                    <span className="truncate text-xs">Panel Petugas</span>
                  </div>
                </div>
              ) : (
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img src={sapuLogo} alt="SapuKota" className="size-6" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">SapuKota</span>
                    <span className="truncate text-xs">Admin Panel</span>
                  </div>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild
                    isActive={item.isActive}
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} onLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
