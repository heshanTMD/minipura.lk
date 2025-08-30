"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CheckoutFormProps {
  cartItems: Array<{
    id: string
    quantity: number
    products: {
      id: string
      name: string
      price: number
    }
  }>
  userProfile: {
    full_name: string | null
    phone: string | null
    address: string | null
  } | null
}

export function CheckoutForm({ cartItems, userProfile }: CheckoutFormProps) {
  const [fullName, setFullName] = useState(userProfile?.full_name || "")
  const [phone, setPhone] = useState(userProfile?.phone || "")
  const [address, setAddress] = useState(userProfile?.address || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("User not authenticated")

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + item.quantity * item.products.price, 0)
      const shipping = total > 50 ? 0 : 5.99
      const tax = total * 0.08
      const finalTotal = total + shipping + tax

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.user.id,
          total_amount: finalTotal,
          status: "pending",
          payment_status: "pending",
          shipping_address: `${fullName}\n${phone}\n${address}`,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: item.products.price,
      }))

      const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

      if (orderItemsError) throw orderItemsError

      // Update user profile if needed
      if (userProfile?.full_name !== fullName || userProfile?.phone !== phone || userProfile?.address !== address) {
        await supabase.from("profiles").update({ full_name: fullName, phone, address }).eq("id", user.user.id)
      }

      router.push(`/payment?orderId=${order.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Shipping Address *</Label>
        <Textarea
          id="address"
          placeholder="Enter your complete shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          required
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "Processing..." : "Continue to Payment"}
      </Button>
    </form>
  )
}
