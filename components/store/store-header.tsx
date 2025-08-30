"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingCart, Search, User } from "lucide-react"

export function StoreHeader() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get cart count
        const { count } = await supabase
          .from("cart_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        setCartCount(count || 0)

        const { data: adminData } = await supabase.from("admin_users").select("id").eq("id", user.id).single()
        setIsAdmin(!!adminData)
      }
    }

    getUser()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold">
            eCommerce Store
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/products">Products</Link>
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" className="relative">
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="ghost" className="text-orange-600 hover:text-orange-700">
                    <Link href="/admin/dashboard">Admin</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
