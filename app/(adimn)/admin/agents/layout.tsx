import ManageAgent from "@/components/admin/agents/ManageAgent";


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ManageAgent>
      {children}
    </ManageAgent>
  )
}
