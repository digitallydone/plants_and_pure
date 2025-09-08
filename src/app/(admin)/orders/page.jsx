import { Suspense } from "react"
import OrdersPageWrapper from "./page-wrapper"
import Loading from "./loading"

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersPageWrapper />
    </Suspense>
  )
}
