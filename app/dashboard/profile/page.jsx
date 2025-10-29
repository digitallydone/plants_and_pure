import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "./profile-form"
import AddressesForm from "./addresses-form"
import PasswordForm from "./password-form"

export default async function ProfilePage() {
  // Get current user
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/profile")
  }

  // Fetch user data with addresses
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
    },
  })

  if (!user) {
    redirect("/auth/login?callbackUrl=/dashboard/profile")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          {/* <TabsTrigger value="addresses">Addresses</TabsTrigger> */}
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Manage your shipping and billing addresses.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddressesForm addresses={user.addresses} />
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password here.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
