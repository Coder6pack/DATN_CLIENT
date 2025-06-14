"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RevenueLineChart } from "./revenue-line-chart";
import { endOfDay, format, startOfDay } from "date-fns";
import { useState } from "react";
import { useDashboardIndicator } from "@/app/queries/useIndicator";

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const { data } = useDashboardIndicator({
    fromDate,
    toDate,
  });
  if (!data) {
    return;
  }
  const revenue = data.payload.data.revenue ?? 0;
  const orderCount = data.payload.data.orderCount ?? 0;
  const servingOrderCount = data.payload.data.servingOrderCount ?? 0;
  const revenueByDate = data.payload.data.revenueByDate ?? [];
  const dishIndicator = data.payload.data.orderIndicator ?? [];
  const totalProfit = data.payload.data.totalProfit ?? 0;

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2">From</span>
          <Input
            type="datetime-local"
            placeholder="From"
            className="text-sm"
            value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setFromDate(new Date(event.target.value))}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">To</span>
          <Input
            type="datetime-local"
            placeholder="To"
            value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setToDate(new Date(event.target.value))}
          />
        </div>
        <Button className="" variant={"outline"} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenue) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalProfit) || 0}
            </div>
            <p className="text-xs text-muted-foreground">VND</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount || 0}</div>
            <p className="text-xs text-muted-foreground">Payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Order is Pending
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servingOrderCount || 0}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueLineChart chartData={revenueByDate} />
        </div>
        <div className="lg:col-span-3">{/* <DishBarChart /> */}</div>
      </div>
    </div>
  );
}
