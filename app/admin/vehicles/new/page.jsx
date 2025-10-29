import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VehicleForm from "../vehicle-form"

export default async function NewVehiclePage() {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/vehicles/new")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Vehicle</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Add a new vehicle to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleForm />
        </CardContent>
      </Card>
    </div>
  )
}
