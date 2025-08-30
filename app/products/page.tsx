import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SearchParams {
  search?: string
  category?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Apply search filter
  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  // Apply category filter
  if (params.category) {
    query = query.eq("category_id", params.category)
  }

  const { data: products, error } = await query

  // Get categories for sidebar
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant={!params.category ? "default" : "ghost"} className="w-full justify-start">
                  <Link href="/products">All Products</Link>
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    asChild
                    variant={params.category === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={`/products?category=${category.id}`}>{category.name}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {params.search ? `Search results for "${params.search}"` : "All Products"}
              </h1>
              <p className="text-muted-foreground">{products?.length || 0} products found</p>
            </div>

            {products && products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {params.search || params.category
                    ? "Try adjusting your search or browse all products"
                    : "No products are currently available"}
                </p>
                {(params.search || params.category) && (
                  <Button asChild>
                    <Link href="/products">View All Products</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
