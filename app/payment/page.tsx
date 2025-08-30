"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { StoreHeader } from "@/components/store/store-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: any) => void
      onCompleted: (orderId: string) => void
      onDismissed: () => void
      onError: (error: string) => void
    }
  }
}

export default function PaymentPage() {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) {
      router.push("/cart")
      return
    }

    const fetchOrder = async () => {
      const supabase = createClient()

      try {
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) {
          router.push("/auth/login")
          return
        }

        const { data: orderData, error: orderError } = await supabase
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
          .eq("id", orderId)
          .eq("user_id", user.user.id)
          .single()

        if (orderError || !orderData) {
          throw new Error("Order not found")
        }

        setOrder(orderData)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  useEffect(() => {
    // Load PayHere script
    const script = document.createElement("script")
    script.src = "https://www.payhere.lk/lib/payhere.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initiatePayment = async () => {
    if (!order || !window.payhere) return

    const supabase = createClient()

    // PayHere payment object
    const payment = {
      sandbox: true, // Set to false for production
      merchant_id: "1227368", // Replace with your PayHere Merchant ID
      return_url: `${window.location.origin}/payment-success?orderId=${order.id}`,
      cancel_url: `${window.location.origin}/payment-cancel?orderId=${order.id}`,
      notify_url: `${window.location.origin}/api/payment/notify`,
      order_id: order.id,
      items: order.order_items.map((item: any) => item.products.name).join(", "),
      amount: order.total_amount.toFixed(2),
      currency: "USD",
      hash: "", // This should be generated server-side for security
      first_name: order.shipping_address.split("\n")[0] || "Customer",
      last_name: "",
      email: "", // You might want to get this from user profile
      phone: order.shipping_address.split("\n")[1] || "",
      address: order.shipping_address.split("\n").slice(2).join(" ") || "",
      city: "Colombo",
      country: "Sri Lanka",
    }

    // PayHere callbacks
    window.payhere.onCompleted = async (orderId: string) => {
      console.log("Payment completed. OrderID:" + orderId)

      // Update order status
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "confirmed",
        })
        .eq("id", order.id)

      // Clear cart
      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        await supabase.from("cart_items").delete().eq("user_id", user.user.id)
      }

      router.push(`/order-success?orderId=${order.id}`)
    }

    window.payhere.onDismissed = () => {
      console.log("Payment dismissed")
    }

    window.payhere.onError = (error: string) => {
      console.log("Error:" + error)
      setError("Payment failed. Please try again.")
    }

    // Start payment
    window.payhere.startPayment(payment)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Payment Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive mb-4">{error || "Order not found"}</p>
              <Button onClick={() => router.push("/cart")} className="w-full">
                Return to Cart
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Order Summary</h3>
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
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You will be redirected to PayHere to complete your payment securely.
                </p>
                <div className="flex items-center gap-2">
                  <img src="/payhere-logo.png" alt="PayHere" className="h-8" />
                  <span className="text-sm text-muted-foreground">Secure Payment Gateway</span>
                </div>
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

              <div className="flex gap-4">
                <Button onClick={initiatePayment} className="flex-1" size="lg">
                  Pay Now
                </Button>
                <Button onClick={() => router.push("/cart")} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
