import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  // Get user orders with order items and products
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          price,
          image_url
        )
      )
    `)
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mb-2">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "confirmed"
                                ? "secondary"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Badge
                          variant={
                            order.payment_status === "completed"
                              ? "default"
                              : order.payment_status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </div>
                      <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.order_items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 relative overflow-hidden rounded-md flex-shrink-0">
                          {item.products.image_url ? (
                            <img
                              src={item.products.image_url || "/placeholder.svg"}
                              alt={item.products.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <p className="text-sm text-muted-foreground">+{order.order_items.length - 3} more items</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Orders Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
