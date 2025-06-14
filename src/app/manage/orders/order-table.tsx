"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import { formatCurrency, handleHttpErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye, Package, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListOrder, useCancelOrderMutation } from "@/app/queries/useOrder";

import OrderDetail from "./order-detail";
import UpdateOrderStatus from "./update-order";
import {
  OrderStatusColors,
  OrderStatusLabels,
  OrderStatusType,
} from "@/constants/order.constant";
import { ProductSKUSnapShotType } from "@/shared/models/shared-order.model";

// Type for order list item based on GetOrderListResSchema
type OrderListItem = {
  id: number;
  userId: number;
  status: OrderStatusType;
  paymentId: number;
  createdAt: Date;
  updatedAt: Date;
  items: ProductSKUSnapShotType[];
};

const OrderTableContext = createContext<{
  setOrderIdDetail: (value: number | undefined) => void;
  orderIdDetail: number | undefined;
  setOrderIdUpdate: (value: number | undefined) => void;
  orderIdUpdate: number | undefined;
  orderDelete: OrderListItem | null;
  setOrderDelete: (value: OrderListItem | null) => void;
}>({
  setOrderIdDetail: () => {},
  orderIdDetail: undefined,
  setOrderIdUpdate: () => {},
  orderIdUpdate: undefined,
  orderDelete: null,
  setOrderDelete: () => {},
});

export const columns: ColumnDef<OrderListItem>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "userId",
    header: "Customer ID",
    cell: ({ row }) => <div>#{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatusType;
      return (
        <Badge className={OrderStatusColors[status]}>
          {OrderStatusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as ProductSKUSnapShotType[];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      return (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>
            {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
          </span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const items = row.getValue("items") as ProductSKUSnapShotType[];
      const total = items.reduce(
        (sum, item) => sum + item.skuPrice * item.quantity,
        0
      );
      return <div className="font-medium">{formatCurrency(total)} VND</div>;
    },
  },
  {
    accessorKey: "paymentId",
    header: "Payment ID",
    cell: ({ row }) => <div>#{row.getValue("paymentId")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderIdDetail, setOrderIdUpdate, setOrderDelete } =
        useContext(OrderTableContext);

      const openOrderDetail = () => {
        setOrderIdDetail(row.original.id);
      };

      const openUpdateStatus = () => {
        setOrderIdUpdate(row.original.id);
      };

      const openDeleteOrder = () => {
        setOrderDelete(row.original);
      };

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openOrderDetail}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openUpdateStatus}>
              <Package className="w-4 h-4 mr-2" />
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openDeleteOrder}
              className="text-destructive"
            >
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteOrder({
  orderDelete,
  setOrderDelete,
}: {
  orderDelete: OrderListItem | null;
  setOrderDelete: (value: OrderListItem | null) => void;
}) {
  const { mutateAsync } = useCancelOrderMutation();

  const handleDelete = async () => {
    if (orderDelete) {
      try {
        await mutateAsync({
          id: orderDelete.id,
          body: {},
        });
        toast({
          title: "Order cancelled",
          description: `Order #${orderDelete.id} has been cancelled successfully.`,
        });
        setOrderDelete(null);
      } catch (error) {
        handleHttpErrorApi({
          error,
        });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(orderDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setOrderDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel order{" "}
            <span className="font-medium">#{orderDelete?.id}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground"
          >
            Cancel Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function OrderTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [orderIdDetail, setOrderIdDetail] = useState<number | undefined>();
  const [orderIdUpdate, setOrderIdUpdate] = useState<number | undefined>();
  const [orderDelete, setOrderDelete] = useState<OrderListItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatusType | "all">(
    "all"
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const [activeFilters, setActiveFilters] = useState<{
    status: boolean;
    id: boolean;
    userId: boolean;
  }>({
    status: false,
    id: false,
    userId: false,
  });

  const getOrders = useListOrder();

  const data = getOrders.data?.payload.data ?? [];
  const totalPages = getOrders.data?.payload.totalPages ?? 0;
  const totalItems = getOrders.data?.payload.totalItems ?? 0;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    setActiveFilters({
      status: statusFilter !== "all",
      id: Boolean(table.getColumn("id")?.getFilterValue()),
      userId: Boolean(table.getColumn("userId")?.getFilterValue()),
    });
  }, [statusFilter, table]);

  const clearAllFilters = () => {
    setStatusFilter("all");
    table.getColumn("id")?.setFilterValue("");
    table.getColumn("userId")?.setFilterValue("");
  };

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <OrderTableContext.Provider
      value={{
        orderIdDetail,
        setOrderIdDetail,
        orderIdUpdate,
        setOrderIdUpdate,
        orderDelete,
        setOrderDelete,
      }}
    >
      <div className="w-full">
        <OrderDetail id={orderIdDetail} setId={setOrderIdDetail} />
        <UpdateOrderStatus id={orderIdUpdate} setId={setOrderIdUpdate} />
        <AlertDialogDeleteOrder
          orderDelete={orderDelete}
          setOrderDelete={setOrderDelete}
        />

        <div className="space-y-4 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Input
              placeholder="Filter by Order ID..."
              value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("id")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as OrderStatusType | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(OrderStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            OrderStatusColors[value as OrderStatusType].split(
                              " "
                            )[0]
                          }`}
                        />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter by Customer ID..."
                value={
                  (table.getColumn("userId")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("userId")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
          </div>

          {statusFilter !== "all" && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active filter:</span>
              <Badge variant="outline" className="flex items-center gap-1">
                Status: {OrderStatusLabels[statusFilter as OrderStatusType]}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setStatusFilter("all")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {getOrders.isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-t-2 border-primary rounded-full" />
                      <div>Loading orders...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1">
            Showing <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
            of <strong>{totalItems}</strong> orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {totalPages || 1}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  );
}
