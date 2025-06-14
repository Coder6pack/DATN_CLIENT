"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import AutoPagination from "@/components/auto-pagination";
import { handleHttpErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import EditBrand from "./edit-brand";
import AddBrand from "./add-brand";
import { useDeleteBrandMutation, useListBrand } from "@/app/queries/useBrand";
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
import { GetBrandsResType } from "@/schemaValidations/brand.model";
import { BrandType } from "@/shared/models/shared-brand.model";

const BrandTableContext = createContext<{
  setBrandIdEdit: (value: number) => void;
  brandIdEdit: number | undefined;
  brandDelete: BrandType | null;
  setBrandDelete: (value: BrandType | null) => void;
}>({
  setBrandIdEdit: (value: number | undefined) => {},
  brandIdEdit: undefined,
  brandDelete: null,
  setBrandDelete: (value: BrandType | null) => {},
});

export const columns: ColumnDef<BrandType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage
            src={row.getValue("logo")}
            width={"100px"}
            height={"100px"}
          />
          <AvatarFallback className="rounded-none">
            {row.original.name}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      // Kiểm tra và chuyển đổi
      const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setBrandIdEdit, setBrandDelete } = useContext(BrandTableContext);
      const openEditEmployee = () => {
        setBrandIdEdit(row.original.id);
      };

      const openDeleteBrand = () => {
        setBrandDelete({
          ...row.original,
          createdAt: new Date(),
          createdById: null,
          deletedAt: new Date(),
          deletedById: null,
          updatedAt: new Date(),
          updatedById: null,
        });
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
            <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteBrand}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteBrand({
  brandDelete,
  setBrandDelete,
}: {
  brandDelete: BrandType | null;
  setBrandDelete: (value: BrandType | null) => void;
}) {
  const { mutateAsync } = useDeleteBrandMutation();
  const deleteBrand = async () => {
    if (brandDelete) {
      try {
        const result = await mutateAsync(brandDelete.id);
        setBrandDelete(null);
        toast({
          title: "Delete brand successfully",
        });
      } catch (error) {
        handleHttpErrorApi({
          error,
        });
      }
    }
  };
  return (
    <AlertDialog
      open={Boolean(brandDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setBrandDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhãn hàng?</AlertDialogTitle>
          <AlertDialogDescription>
            Nhãn hàng{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {brandDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteBrand}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function BrandTable() {
  const getBrands = useListBrand();
  const data = getBrands.data?.payload.data ?? [];
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [brandIdEdit, setBrandIdEdit] = useState<number | undefined>();
  const [brandDelete, setBrandDelete] = useState<BrandType | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <BrandTableContext.Provider
      value={{
        brandIdEdit,
        setBrandIdEdit,
        brandDelete,
        setBrandDelete,
      }}
    >
      <div className="w-full">
        <EditBrand
          id={brandIdEdit}
          setId={setBrandIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteBrand
          brandDelete={brandDelete}
          setBrandDelete={setBrandDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddBrand />
          </div>
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
              {table.getRowModel().rows?.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/brand"
            />
          </div>
        </div>
      </div>
    </BrandTableContext.Provider>
  );
}
