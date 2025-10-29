"use client"

import { CheckCircle2, Clock, Package, ShoppingCart, Truck, XCircle } from "lucide-react"

export default function OrderTimeline({ order }) {
  const steps = [
    {
      id: "pending",
      name: "Order Placed",
      icon: ShoppingCart,
      description: "Your order has been placed",
    },
    {
      id: "processing",
      name: "Processing",
      icon: Clock,
      description: "Your order is being processed",
    },
    {
      id: "shipped",
      name: "Shipped",
      icon: Package,
      description: "Your order has been shipped",
    },
    {
      id: "delivered",
      name: "Delivered",
      icon: Truck,
      description: "Your order has been delivered",
    },
  ]

  // Determine the current step based on order status
  const currentStepIndex = steps.findIndex((step) => step.id === order.status)
  const isCancelled = order.status === "cancelled"

  return (
    <div className="mt-8">
      {isCancelled ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Order Cancelled</h3>
            <p className="mt-1 text-sm text-gray-500">
              This order was cancelled on {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <ol className="relative border-l border-gray-200 ml-3">
          {steps.map((step, stepIdx) => {
            const isActive = stepIdx <= currentStepIndex
            const isCompleted = stepIdx < currentStepIndex

            return (
              <li key={step.id} className="mb-10 ml-6">
                <span
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white
                  ${isActive ? "bg-green-100" : "bg-gray-100"}
                `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <step.icon className={`w-5 h-5 ${isActive ? "text-green-500" : "text-gray-400"}`} />
                  )}
                </span>
                <h3
                  className={`flex items-center mb-1 text-lg font-semibold
                  ${isActive ? "text-gray-900" : "text-gray-400"}
                `}
                >
                  {step.name}
                  {stepIdx === currentStepIndex && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                      Current
                    </span>
                  )}
                </h3>
                <p className={`mb-4 text-sm ${isActive ? "text-gray-500" : "text-gray-400"}`}>{step.description}</p>
                {step.id === "shipped" && order.trackingNumber && isActive && (
                  <p className="text-sm text-gray-500">
                    Tracking number: <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
