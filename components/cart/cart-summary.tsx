"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface CartSummaryProps {
  items: Array<{
    id: string
    quantity: number
    products: {
      price: number
    }
  }>
  total: number
}

export function CartSummary({ items, total }: CartSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = total > 50 ? 0 : 5.99 // Free shipping over $50
  const tax = total * 0.08 // 8% tax
  const finalTotal = total + shipping + tax

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} items)</span>
          <span>${total.toFixed(2)}</span>
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
          <span>${finalTotal.toFixed(2)}</span>
        </div>

        {shipping > 0 && (
          <p className="text-sm text-muted-foreground">Add ${(50 - total).toFixed(2)} more for free shipping</p>
        )}

        <div className="space-y-2">
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
