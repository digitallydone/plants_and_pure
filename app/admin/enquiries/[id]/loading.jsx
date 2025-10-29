import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enquiry Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-48" />
            </div>

            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <Skeleton className="h-4 w-48" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-64" />
          </CardFooter>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-48 w-full rounded-md" />

            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="h-6 w-32" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
