import http from "@/lib/http";
import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType,
} from "@/schemaValidations/dashboard.model";

import queryString from "query-string";

const indicatorApiRequest = {
  getDashboardIndicators: (queryParams: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      "/dashboards?" +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    ),
};

export default indicatorApiRequest;
