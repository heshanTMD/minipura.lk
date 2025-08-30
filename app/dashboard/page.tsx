import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StoreHeader } from "@/components/store/store-header"
import Link from "next/link"
import { Package, User, ShoppingCart, CreditCard } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user statistics
  const [{ count: ordersCount }, { count: cartCount }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", data.user.id),
    supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", data.user.id),
  ])

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || "Customer"}!</h1>
          <p className="text-muted-foreground">Manage your account and track your orders</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cartCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{new Date(data.user.created_at).getFullYear()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild className="w-full justify-start h-auto p-4">
                <Link href="/orders" className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">View Orders</div>
                    <div className="text-sm text-muted-foreground">Track your order history</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <Link href="/profile" className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Edit Profile</div>
                    <div className="text-sm text-muted-foreground">Update your personal information</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <Link href="/cart" className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">View Cart</div>
                    <div className="text-sm text-muted-foreground">Review items in your cart</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <Link href="/products" className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Continue Shopping</div>
                    <div className="text-sm text-muted-foreground">Browse our latest products</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_items.length} items • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button asChild size="sm">
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="mt-8 pt-8 border-t">
          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
