import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  if (!params.orderId) {
    redirect("/")
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          price
        )
      )
    `)
    .eq("id", params.orderId)
    .eq("user_id", user.user.id)
    .single()

  if (orderError || !order) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Thank you for your order</p>
                <p className="font-mono text-sm bg-muted p-2 rounded">Order ID: {order.id}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Order Details</h3>
                <div className="space-y-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.products.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total_amount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What's Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• We'll process your order within 1-2 business days</li>
                  <li>• You'll get tracking information once your order ships</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">View Orders</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
