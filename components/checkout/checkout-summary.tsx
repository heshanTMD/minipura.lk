import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface CheckoutSummaryProps {
  items: Array<{
    id: string
    quantity: number
    products: {
      id: string
      name: string
      price: number
      image_url: string | null
    }
  }>
  total: number
}

export function CheckoutSummary({ items, total }: CheckoutSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = total > 50 ? 0 : 5.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 relative overflow-hidden rounded-md flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.products.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium">${(item.products.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
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
        </div>
      </CardContent>
    </Card>
  )
}
