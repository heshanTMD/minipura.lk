import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Exclude static files, images, and favicon from middleware
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
