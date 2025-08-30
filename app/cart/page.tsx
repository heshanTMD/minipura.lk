import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function CartPage() {
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
    .order("created_at", { ascending: false })

  if (cartError) {
    console.error("Error fetching cart items:", cartError)
  }

  const validCartItems = cartItems?.filter((item) => item.products && item.products.is_active) || []
  const total = validCartItems.reduce((sum, item) => sum + item.quantity * item.products.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{validCartItems.length} items in your cart</p>
        </div>

        {validCartItems.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {validCartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary items={validCartItems} total={total} />
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
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
