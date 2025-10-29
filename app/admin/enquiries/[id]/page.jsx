import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, Car } from "lucide-react"
import prisma from "@/lib/prisma"
import EnquiryStatusForm from "./enquiry-status-form"

export default async function EnquiryDetailsPage({ params }) {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session?.user || session.user.role !== "admin") {
    return notFound()
  }

  // Fetch the enquiry
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
    include: {
      vehicle: true,
    },
  })

  if (!enquiry) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/enquiries">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Enquiry Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enquiry Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enquiry Information</CardTitle>
            <CardDescription>Details of the customer enquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Customer Name</h3>
                <p className="text-lg font-medium">{enquiry.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Status</h3>
                <Badge
                  className={
                    enquiry.status === "new"
                      ? "bg-blue-500"
                      : enquiry.status === "contacted"
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }
                >
                  {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">
                  {enquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:underline">
                  {enquiry.phone}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Message</h3>
              <div className="bg-slate-50 p-4 rounded-md whitespace-pre-wrap">{enquiry.message}</div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>Submitted on {new Date(enquiry.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <EnquiryStatusForm id={enquiry.id} currentStatus={enquiry.status} />
          </CardFooter>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Details of the enquired vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enquiry.vehicle?.images && enquiry.vehicle.images.length > 0 && (
              <div className="aspect-video rounded-md overflow-hidden bg-slate-100">
                <img
                  src={enquiry.vehicle.images[0] || "/placeholder.svg"}
                  alt={`${enquiry.vehicle.make} ${enquiry.vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="text-xl font-medium">
                {enquiry.vehicle?.year} {enquiry.vehicle?.make} {enquiry.vehicle?.model}
              </h3>
              <p className="text-lg font-bold text-primary">${enquiry.vehicle?.price.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Transmission:</span> {enquiry.vehicle?.transmission}
              </div>
              <div>
                <span className="text-slate-500">Fuel Type:</span> {enquiry.vehicle?.fuelType}
              </div>
              <div>
                <span className="text-slate-500">Body Type:</span> {enquiry.vehicle?.bodyType}
              </div>
              <div>
                <span className="text-slate-500">Color:</span> {enquiry.vehicle?.color}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-slate-500" />
              <Badge>{enquiry.vehicle?.status.charAt(0).toUpperCase() + enquiry.vehicle?.status.slice(1)}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/vehicles/${enquiry.vehicle?.id}`} target="_blank">
              <Button variant="outline">View Vehicle</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
