import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import VehicleForm from "../../vehicle-form"
import prisma from "@/lib/prisma"

export default async function EditVehiclePage({ params }) {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session?.user || session.user.role !== "admin") {
    return notFound()
  }

  // Fetch the vehicle
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  })

  if (!vehicle) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Vehicle</h1>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  )
}
