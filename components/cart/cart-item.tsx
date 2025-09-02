"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItemProps {
  item: {
    id: string
    quantity: number
      products: {
      id: string
      name: string
      price: number
      image_url: string | null
      stock_quantity: number
    }
  }
}

export function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.products.stock_quantity) return

    const supabase = createClient()
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", item.id)

      if (error) throw error

      setQuantity(newQuantity)
      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async () => {
    const supabase = createClient()
    setIsRemoving(true)

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", item.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsRemoving(false)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value)
    if (
      !isNaN(newQuantity) &&
      newQuantity >= 1 &&
      newQuantity <= item.products.stock_quantity
    ) {
      updateQuantity(newQuantity)
    }
  }

  if (!item.products) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
            {item.products.image_url ? (
              <Image
                src={item.products.image_url}
                alt={item.products.name}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/products/${item.products.id}`} className="font-semibold hover:underline">
                {item.products.name}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeItem}
                disabled={isRemoving}
                className="text-destructive hover:text-destructive"
                type="button"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                  type="button"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  type="number"
                  min={1}
                  max={item.products.stock_quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isUpdating}
                  className="w-16 text-center"
                  aria-label="Quantity"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={quantity >= item.products.stock_quantity || isUpdating}
                  type="button"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <span className="text-sm text-muted-foreground ml-2">
                  {item.products.stock_quantity} available
                </span>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  ${Number(item.products.price * quantity).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${Number(item.products.price).toFixed(2)} each
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
