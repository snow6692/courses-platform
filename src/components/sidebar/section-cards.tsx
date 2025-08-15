import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashbaord-stats";

export async function SectionCards() {
  const { totalCourses, totalCustomers, totalLessons, totalUsers } =
    await adminGetDashboardStats();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>

          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
            </CardTitle>

            <IconUsers className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Registered users on the platform
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
            <IconShoppingCart className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Users who have enrolled in courses
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
            <IconBook className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Available courses on the platform
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lessons</CardDescription>
          <div className="flex items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
            <IconPlaylistX className="text-muted-foreground size-6" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total learning content available
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
