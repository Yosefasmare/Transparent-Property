import AuthCheck from '@/components/admin/AuthCheck';
import { MobileSidebarProvider } from '@/components/admin/MobileSidebarContext'


export default async function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <MobileSidebarProvider>
         <AuthCheck>
           {children}
         </AuthCheck>
       </MobileSidebarProvider>
  )
}
