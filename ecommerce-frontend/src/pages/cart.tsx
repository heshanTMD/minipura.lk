import React from 'react'
import CartSidebar from '@/components/cart/CartSidebar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/footer/Footer'

const CartPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Your Shopping Cart</h1>
        <CartSidebar />
      </main>
      <Footer />
    </div>
  )
}

export default CartPage