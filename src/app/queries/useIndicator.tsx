import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/dashboard.model";
import { useQuery } from "@tanstack/react-query";
import indicatorApiRequest from "../apiRequests/indicator";

export const useDashboardIndicator = (
  queryParams: DashboardIndicatorQueryParamsType
) => {
  return useQuery({
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
    queryKey: ["dashboardIndicators", queryParams],
  });
};
