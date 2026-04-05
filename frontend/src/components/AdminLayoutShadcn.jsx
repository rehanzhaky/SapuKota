import { Link } from "react-router-dom"
import { AppSidebar } from "@/components/SapuKotaSidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

export default function AdminLayoutShadcn({ children }) {
  const location = useLocation()
  
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/admin/dashboard') return 'Dashboard'
    if (path === '/admin/laporan') return 'Kelola Laporan'
    if (path === '/admin/petugas') return 'Kelola Petugas'
    if (path === '/admin/statistik') return 'Statistik'
    if (path === '/petugas/dashboard') return 'Dashboard Petugas'
    return 'Admin'
  }

  const getPageDescription = () => {
    const path = location.pathname
    if (path === '/admin/dashboard') return 'Kelola dan monitor laporan sampah'
    if (path === '/admin/laporan') return 'Review dan kelola laporan masuk'
    if (path === '/admin/petugas') return 'Kelola data petugas lapangan'
    if (path === '/admin/statistik') return 'Analisis dan statistik laporan'
    if (path === '/petugas/dashboard') return 'Kelola tugas pengangkutan'
    return ''
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/">Beranda</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {getPageDescription() && (
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">{getPageTitle()}</h1>
            </div>
          )}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
