import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.user.id)
    .single()

  if (adminError || !adminData) {
    redirect("/admin/login")
  }

  // Get orders with user profiles
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>{order.profiles?.full_name || "Unknown"}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.payment_status === "completed"
                              ? "default"
                              : order.payment_status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
