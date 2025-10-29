import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettingsForm from "./general-settings-form"
import EmailSettingsForm from "./email-settings-form"
import PaymentSettingsForm from "./payment-settings-form"

export default async function SettingsPage() {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/settings")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>Manage your store settings and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="pt-6">
              <GeneralSettingsForm />
            </TabsContent>
            <TabsContent value="email" className="pt-6">
              <EmailSettingsForm />
            </TabsContent>
            <TabsContent value="payment" className="pt-6">
              <PaymentSettingsForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
