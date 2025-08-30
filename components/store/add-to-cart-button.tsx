"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
  productId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ productId, disabled, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Check if user is logged in
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push("/auth/login")
        return
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        })

        if (error) throw error
      }

      // Refresh the page to update cart count
      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || isLoading} className={className}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
