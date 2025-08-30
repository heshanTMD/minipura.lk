import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  // Get cart items with product details
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (
        id,
        name,
        price,
        image_url,
        stock_quantity,
        is_active
      )
    `)
    .eq("user_id", user.user.id)

  if (cartError) {
    console.error("Error fetching cart items:", cartError)
  }

  const validCartItems = cartItems?.filter((item) => item.products && item.products.is_active) || []

  if (validCartItems.length === 0) {
    redirect("/cart")
  }

  // Get user profile for pre-filling form
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()

  const total = validCartItems.reduce((sum, item) => sum + item.quantity * item.products.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm cartItems={validCartItems} userProfile={profile} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <CheckoutSummary items={validCartItems} total={total} />
          </div>
        </div>
      </main>
    </div>
  )
}
