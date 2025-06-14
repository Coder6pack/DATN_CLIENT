import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import OrderTable from "./order-table";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and track their status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage customer orders and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrderTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
