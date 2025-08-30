import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const orderId = params.get("order_id")
    const paymentId = params.get("payment_id")
    const paymentStatus = params.get("status_code")
    const hash = params.get("md5sig")

    // Verify the hash (you should implement proper hash verification)
    // This is a simplified version - in production, verify the hash properly

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update order based on payment status
    let orderStatus = "pending"
    let paymentStatusValue = "pending"

    if (paymentStatus === "2") {
      // PayHere success status code
      orderStatus = "confirmed"
      paymentStatusValue = "completed"
    } else if (paymentStatus === "-1" || paymentStatus === "-2") {
      // PayHere failure status codes
      orderStatus = "cancelled"
      paymentStatusValue = "failed"
    }

    const { error } = await supabase
      .from("orders")
      .update({
        payment_id: paymentId,
        payment_status: paymentStatusValue,
        status: orderStatus,
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
