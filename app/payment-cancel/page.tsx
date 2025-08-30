import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function PaymentCancelPage({
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
    .select("*")
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
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Your payment was cancelled</p>
                <p className="font-mono text-sm bg-muted p-2 rounded">Order ID: {order.id}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Payment Status: {order.payment_status}
                  </span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Don't worry! Your order is still saved and you can complete the payment anytime.
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">What would you like to do?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Try payment again with the same order</li>
                    <li>• Return to cart to modify your order</li>
                    <li>• Continue shopping for more items</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href={`/payment?orderId=${order.id}`}>Try Payment Again</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/cart">Return to Cart</Link>
                </Button>
              </div>

              <div className="text-center">
                <Button asChild variant="ghost">
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
