import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.user.id)
    .single()

  if (orderError || !order) {
    notFound()
  }

  const subtotal = order.order_items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/orders">← Back to Orders</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 relative overflow-hidden rounded-lg flex-shrink-0">
                      {item.products.image_url ? (
                        <Image
                          src={item.products.image_url || "/placeholder.svg"}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.products.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Quantity: {item.quantity}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">${item.price} each</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Order Status</span>
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
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
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
                <div className="text-sm text-muted-foreground">
                  <p>Order placed: {new Date(order.created_at).toLocaleDateString()}</p>
                  {order.payment_id && <p>Payment ID: {order.payment_id}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm">{order.shipping_address}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
