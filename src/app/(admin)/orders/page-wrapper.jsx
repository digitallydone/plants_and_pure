// "use client"

// import { useState, useEffect, useCallback, memo } from "react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
// import { Checkbox } from "@/components/ui/checkbox"
// import { formatDate, formatCurrency } from "@/lib/utils"
// import { Search, Plus, Filter, ArrowUpDown } from "lucide-react"
// import BulkActions from "./bulk-actions"
// import { getOrders } from "@/app/actions/order"

// // Memoize the table row to prevent unnecessary re-renders
// const OrderRow = memo(({ order, isSelected, onSelectOrder }) => {
//   return (
//     <TableRow key={order.id}>
//       <TableCell className="w-[50px]">
//         <Checkbox
//           checked={isSelected}
//           onCheckedChange={() => onSelectOrder(order.id)}
//           aria-label={`Select order ${order.orderNumber}`}
//         />
//       </TableCell>
//       <TableCell>
//         <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
//           #{order.orderNumber}
//         </Link>
//       </TableCell>
//       <TableCell>{order.user?.name || "Guest"}</TableCell>
//       <TableCell>{formatDate(order.createdAt)}</TableCell>
//       <TableCell>
//         <Badge
//           className={
//             order.status === "completed"
//               ? "bg-green-500"
//               : order.status === "processing"
//                 ? "bg-blue-500"
//                 : order.status === "shipped"
//                   ? "bg-purple-500"
//                   : order.status === "pending"
//                     ? "bg-amber-500"
//                     : "bg-red-500"
//           }
//         >
//           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//         </Badge>
//       </TableCell>
//       <TableCell>
//         <Badge
//           variant={
//             order.paymentStatus === "paid" ? "default" : order.paymentStatus === "pending" ? "outline" : "destructive"
//           }
//         >
//           {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
//         </Badge>
//       </TableCell>
//       <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
//     </TableRow>
//   )
// })

// OrderRow.displayName = "OrderRow"

// function OrdersPageWrapper() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [pagination, setPagination] = useState({
//     page: Number(searchParams.get("page")) || 1,
//     limit: Number(searchParams.get("limit")) || 10,
//     total: 0,
//     totalPages: 0,
//   })
//   const [filters, setFilters] = useState({
//     status: searchParams.get("status") || "all",
//     paymentStatus: searchParams.get("payment") || "all",
//     search: searchParams.get("search") || "",
//     sort: searchParams.get("sort") || "newest",
//   })
//   const [selectedOrders, setSelectedOrders] = useState([])

//   // Memoize the fetchOrders function to prevent unnecessary re-renders
//   const fetchOrders = useCallback(async () => {
//     setLoading(true)
//     try {
//       // Use the server action instead of fetch API
//       const result = await getOrders({
//         page: pagination.page,
//         limit: pagination.limit,
//         status: filters.status,
//         paymentStatus: filters.paymentStatus,
//         search: filters.search,
//         sort: filters.sort,
//       })

//       if (result && result.orders) {
//         setOrders(result.orders)
//         setPagination({
//           ...pagination,
//           total: result.pagination.total,
//           totalPages: result.pagination.totalPages,
//         })
//       } else {
//         console.error("Failed to fetch orders")
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [pagination.page, filters.status, filters.paymentStatus, filters.search, filters.sort, pagination.limit])

//   useEffect(() => {
//     fetchOrders()
//   }, [fetchOrders])

//   const handlePageChange = (newPage) => {
//     setPagination({
//       ...pagination,
//       page: newPage,
//     })
//   }

//   const handleFilterChange = (name, value) => {
//     setFilters({
//       ...filters,
//       [name]: value,
//     })
//     setPagination({
//       ...pagination,
//       page: 1, // Reset to first page when filters change
//     })
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setPagination({
//       ...pagination,
//       page: 1, // Reset to first page when search changes
//     })
//   }

//   const handleSelectOrder = (orderId) => {
//     setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
//   }

//   const handleSelectAll = (checked) => {
//     setSelectedOrders(checked ? orders.map((order) => order.id) : [])
//   }

//   const handleBulkActionComplete = () => {
//     setSelectedOrders([])
//     fetchOrders()
//   }

//   // Generate pagination items
//   const paginationItems = []
//   for (let i = 1; i <= pagination.totalPages; i++) {
//     if (i === 1 || i === pagination.totalPages || (i >= pagination.page - 1 && i <= pagination.page + 1)) {
//       paginationItems.push(
//         <PaginationItem key={i}>
//           <PaginationLink onClick={() => handlePageChange(i)} isActive={pagination.page === i}>
//             {i}
//           </PaginationLink>
//         </PaginationItem>,
//       )
//     } else if (i === pagination.page - 2 || i === pagination.page + 2) {
//       paginationItems.push(
//         <PaginationItem key={i}>
//           <PaginationLink>...</PaginationLink>
//         </PaginationItem>,
//       )
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Orders</h1>
//         {/* <Link href="/admin/orders/new">
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             New Order
//           </Button>
//         </Link> */}
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 items-end">
//         <div className="w-full md:w-1/3">
//           <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
//             <Input
//               type="search"
//               placeholder="Search orders..."
//               value={filters.search}
//               onChange={(e) => handleFilterChange("search", e.target.value)}
//               className="flex-1"
//             />
//             <Button type="submit" size="icon">
//               <Search className="h-4 w-4" />
//               <span className="sr-only">Search</span>
//             </Button>
//           </form>
//         </div>

//         <div className="flex flex-1 flex-col sm:flex-row gap-4">
//           <div className="w-full sm:w-1/3">
//             <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
//               <SelectTrigger>
//                 <div className="flex items-center">
//                   <Filter className="h-4 w-4 mr-2" />
//                   <span>Status</span>
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="processing">Processing</SelectItem>
//                 <SelectItem value="shipped">Shipped</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="w-full sm:w-1/3">
//             <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange("paymentStatus", value)}>
//               <SelectTrigger>
//                 <div className="flex items-center">
//                   <Filter className="h-4 w-4 mr-2" />
//                   <span>Payment</span>
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Payment Statuses</SelectItem>
//                 <SelectItem value="paid">Paid</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="failed">Failed</SelectItem>
//                 <SelectItem value="refunded">Refunded</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="w-full sm:w-1/3">
//             <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
//               <SelectTrigger>
//                 <div className="flex items-center">
//                   <ArrowUpDown className="h-4 w-4 mr-2" />
//                   <span>Sort</span>
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">Newest First</SelectItem>
//                 <SelectItem value="oldest">Oldest First</SelectItem>
//                 <SelectItem value="total-high">Highest Amount</SelectItem>
//                 <SelectItem value="total-low">Lowest Amount</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {selectedOrders.length > 0 && (
//         <BulkActions selectedOrders={selectedOrders} onActionComplete={handleBulkActionComplete} />
//       )}

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[50px]">
//                 <Checkbox
//                   checked={selectedOrders.length === orders.length && orders.length > 0}
//                   onCheckedChange={handleSelectAll}
//                   aria-label="Select all orders"
//                 />
//               </TableHead>
//               <TableHead>Order</TableHead>
//               <TableHead>Customer</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Payment</TableHead>
//               <TableHead className="text-right">Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-10">
//                   Loading orders...
//                 </TableCell>
//               </TableRow>
//             ) : orders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-10">
//                   No orders found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               orders.map((order) => (
//                 <OrderRow
//                   key={order.id}
//                   order={order}
//                   isSelected={selectedOrders.includes(order.id)}
//                   onSelectOrder={handleSelectOrder}
//                 />
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {pagination.totalPages > 1 && (
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationLink
//                 onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
//                 disabled={pagination.page === 1}
//               >
//                 Previous
//               </PaginationLink>
//             </PaginationItem>
//             {paginationItems}
//             <PaginationItem>
//               <PaginationLink
//                 onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
//                 disabled={pagination.page === pagination.totalPages}
//               >
//                 Next
//               </PaginationLink>
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       )}
//     </div>
//   )
// }

// export default OrdersPageWrapper

"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Search, Plus, Filter, ArrowUpDown, Eye } from "lucide-react"
import BulkActions from "./bulk-actions"
import { getOrders } from "@/app/actions/order"

// Memoize the table row to prevent unnecessary re-renders
const OrderRow = memo(({ order, isSelected, onSelectOrder }) => {
  return (
    <TableRow key={order.id}>
      <TableCell className="w-[50px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelectOrder(order.id)}
          aria-label={`Select order ${order.orderNumber}`}
        />
      </TableCell>
      <TableCell>
        <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
          #{order.orderNumber}
        </Link>
      </TableCell>
      <TableCell>{order.user?.name || "Guest"}</TableCell>
      <TableCell>{formatDate(order.createdAt)}</TableCell>
      <TableCell>
        <Badge
          className={
            order.status === "completed"
              ? "bg-green-500"
              : order.status === "processing"
                ? "bg-blue-500"
                : order.status === "shipped"
                  ? "bg-purple-500"
                  : order.status === "pending"
                    ? "bg-amber-500"
                    : "bg-red-500"
          }
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            order.paymentStatus === "paid" ? "default" : order.paymentStatus === "pending" ? "outline" : "destructive"
          }
        >
          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
      <TableCell>
        <Link href={`/admin/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
})

OrderRow.displayName = "OrderRow"

function OrdersPageWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    paymentStatus: searchParams.get("payment") || "all",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "newest",
  })
  const [selectedOrders, setSelectedOrders] = useState([])

  // Memoize the fetchOrders function to prevent unnecessary re-renders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      // Use the server action instead of fetch API
      const result = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        search: filters.search,
        sort: filters.sort,
      })

      if (result && result.orders) {
        setOrders(result.orders)
        setPagination({
          ...pagination,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        })
      } else {
        console.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters.status, filters.paymentStatus, filters.search, filters.sort])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    })
  }

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    })
    setPagination({
      ...pagination,
      page: 1, // Reset to first page when filters change
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination({
      ...pagination,
      page: 1, // Reset to first page when search changes
    })
  }

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = (checked) => {
    setSelectedOrders(checked ? orders.map((order) => order.id) : [])
  }

  const handleBulkActionComplete = () => {
    setSelectedOrders([])
    fetchOrders()
  }

  // Generate pagination items
  const paginationItems = []
  for (let i = 1; i <= pagination.totalPages; i++) {
    if (i === 1 || i === pagination.totalPages || (i >= pagination.page - 1 && i <= pagination.page + 1)) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={pagination.page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    } else if (i === pagination.page - 2 || i === pagination.page + 2) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink>...</PaginationLink>
        </PaginationItem>,
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/admin/orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>

        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3">
            <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange("paymentStatus", value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Payment</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3">
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>Sort</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="total-high">Highest Amount</SelectItem>
                <SelectItem value="total-low">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedOrders.length > 0 && (
        <BulkActions selectedOrders={selectedOrders} onActionComplete={handleBulkActionComplete} />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all orders"
                />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedOrders.includes(order.id)}
                  onSelectOrder={handleSelectOrder}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
              >
                Previous
              </PaginationLink>
            </PaginationItem>
            {paginationItems}
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default OrdersPageWrapper
