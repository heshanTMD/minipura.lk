import React from 'react'
import CartSidebar from '@/components/cart/CartSidebar'

const CartPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Your Shopping Cart</h1>
        <CartSidebar />
      </main>
    </div>
  )
}

export default CartPage