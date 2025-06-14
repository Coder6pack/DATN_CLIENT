import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import SlideShowTable from "./slide-show-table";

export default function SlideShowPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Slide show</CardTitle>
            <CardDescription>Manage slide show</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <Suspense>
                <SlideShowTable />
              </Suspense>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
