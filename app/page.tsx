import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { StoreHeader } from "@/components/store/store-header"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"

type Category = {
  name: string
}

type Product = {
  id: string
  [key: string]: any
  categories?: Category[]
}

export default async function HomePage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Ensure featuredProducts is always an array
  const featuredProducts: Product[] = Array.isArray(data) ? data : []

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
          <p className="text-xl text-muted-foreground mb-8">Discover amazing products at great prices</p>
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Featured Products</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quality Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We offer only the highest quality products from trusted brands.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fast Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get your orders delivered quickly with our reliable shipping partners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Shop with confidence using our secure payment processing.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
