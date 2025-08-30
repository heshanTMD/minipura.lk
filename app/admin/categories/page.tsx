import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.user.id)
    .single()

  if (adminError || !adminData) {
    redirect("/admin/login")
  }

  // Get categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Button asChild>
            <Link href="/admin/categories/new">Add New Category</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories && categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || "No description"}</TableCell>
                      <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No categories found</p>
                <Button asChild>
                  <Link href="/admin/categories/new">Create your first category</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
