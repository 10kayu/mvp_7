import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decodeMarketAdminSessionToken, MARKET_ADMIN_SESSION_COOKIE } from "@/lib/market/admin-auth"
import { MarketDashboardClient } from "./market-dashboard-client"

export const runtime = "nodejs"

export default function MarketAdminPage() {
  const token = cookies().get(MARKET_ADMIN_SESSION_COOKIE)?.value || null
  const session = decodeMarketAdminSessionToken(token)

  if (!session) {
    redirect("/market/login")
  }

  return <MarketDashboardClient />
}
