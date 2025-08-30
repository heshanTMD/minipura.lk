import { createClient } from "@/lib/supabase/server"
import { StoreHeader } from "@/components/store/store-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get product details
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Get related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {" / "}
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          {product.categories && (
            <>
              {" / "}
              <Link href={`/products?category=${product.categories.id}`} className="hover:text-foreground">
                {product.categories.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {product.image_url ? (
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-lg">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.categories && (
                <Badge variant="secondary" className="mb-2">
                  {product.categories.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="text-3xl font-bold text-primary mb-4">${product.price}</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Stock:</span>
                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
                </Badge>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <AddToCartButton productId={product.id} disabled={product.stock_quantity === 0} className="w-full" />
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/products">← Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="h-full flex flex-col">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {relatedProduct.image_url ? (
                      <Image
                        src={relatedProduct.image_url || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="flex-1 p-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">${relatedProduct.price}</span>
                      <Button asChild size="sm">
                        <Link href={`/products/${relatedProduct.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
