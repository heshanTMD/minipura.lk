import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  image_url: string | null
  categories?: {
    name: string
  } | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          {product.categories && (
            <Badge variant="secondary" className="text-xs">
              {product.categories.name}
            </Badge>
          )}
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            <span className="text-sm text-muted-foreground">
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={product.stock_quantity === 0}>
          <Link href={`/products/${product.id}`}>{product.stock_quantity > 0 ? "View Details" : "Out of Stock"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
