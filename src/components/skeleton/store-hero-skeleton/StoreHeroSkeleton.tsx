import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";

export default function StoreHeroSkeleton() {
  return (
    <Card className="w-full mb-6 bg-linear-to-r from-background to-content2 border-none">
      {/* Header */}
      <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-xl w-14 h-14" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
        </div>

        <div className="flex gap-4">{/* acciones futuras */}</div>
      </CardHeader>

      <Divider className="bg-default-100" />

      {/* Body */}
      <CardBody className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 rounded-full mt-1" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-4 w-full max-w-45 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Observaciones */}
        <div className="mt-6 p-3 rounded-lg border border-default-100">
          <Skeleton className="h-3 w-32 rounded-md mb-2" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}
