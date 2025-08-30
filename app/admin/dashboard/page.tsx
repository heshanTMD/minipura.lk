import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
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

  // Get dashboard stats
  const [{ count: productsCount }, { count: categoriesCount }, { count: ordersCount }, { count: usersCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ])

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the admin dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/products/new"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Add New Product</span>
              </a>
              <a
                href="/admin/categories/new"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Add New Category</span>
              </a>
              <a
                href="/admin/orders"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Manage Orders</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Manage Users</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
