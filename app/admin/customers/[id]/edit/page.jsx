import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CustomerEditForm from "./customer-edit-form"

export default async function CustomerEditPage({ params }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/customers")
  }

  const { id } = params
  if (!id) notFound()

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/admin/customers/${id}`}>
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customer
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Customer</h1>
        </div>
      </div>

      <CustomerEditForm user={user} />
    </div>
  )
}
