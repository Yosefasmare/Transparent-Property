import TopNavigation from '@/components/admin/TopNavigation'
import Sidebar from '@/components/admin/Sidebar'
import { MobileSidebarProvider } from '@/components/admin/MobileSidebarContext'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MobileSidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  )
}
