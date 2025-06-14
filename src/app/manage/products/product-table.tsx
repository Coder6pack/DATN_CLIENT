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
import AddProduct from "./add-product";
import { ProductType } from "@/shared/models/shared-product.model";
import {
  useDeleteProductMutation,
  useListProducts,
} from "@/app/queries/useProduct";
import { useGetBrand } from "@/app/queries/useBrand";
import EditProduct from "./edit-product";
// import EditProduct from "./edit-product";

const ProductTableContext = createContext<{
  setProductIdEdit: (value: number) => void;
  productIdEdit: number | undefined;
  productDelete: ProductType | null;
  setProductDelete: (value: ProductType | null) => void;
}>({
  setProductIdEdit: (value: number | undefined) => {},
  productIdEdit: undefined,
  productDelete: null,
  setProductDelete: (value: ProductType | null) => {},
});

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images: string[] = row.getValue("images");
      return (
        <div>
          <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
            <AvatarImage src={images[0]} width={"100px"} height={"100px"} />
            <AvatarFallback className="rounded-none">
              {row.original.name}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "basePrice",
    header: "Base price",
    cell: ({ row }) => {
      const bPrice = row.getValue("basePrice");
      return (
        <div className="capitalize">{formatCurrency(bPrice as number)} VND</div>
      );
    },
  },
  {
    accessorKey: "virtualPrice",
    header: "Virtual price",
    cell: ({ row }) => {
      const vPrice = row.getValue("virtualPrice");
      return (
        <div className="capitalize">{formatCurrency(vPrice as number)} VND</div>
      );
    },
  },
  {
    accessorKey: "brandId",
    header: "Brand",
    cell: ({ row }) => {
      const brandId = row.getValue("brandId");
      const { data } = useGetBrand({
        id: brandId as number,
        enabled: Boolean(brandId as number),
      });
      const name = data?.payload.name;
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setProductIdEdit, setProductDelete } =
        useContext(ProductTableContext);
      const openEditProduct = () => {
        setProductIdEdit(row.original.id);
      };

      const openDeleteProduct = () => {
        setProductDelete({
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
            <DropdownMenuItem onClick={openEditProduct}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteProduct}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteProduct({
  productDelete,
  setProductDelete,
}: {
  productDelete: ProductType | null;
  setProductDelete: (value: ProductType | null) => void;
}) {
  const { mutateAsync } = useDeleteProductMutation();
  const deleteProduct = async () => {
    if (productDelete) {
      try {
        const result = await mutateAsync(productDelete.id);
        setProductDelete(null);
        toast({
          title: "Delete product successfully",
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
      open={Boolean(productDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setProductDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            Product{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {productDelete?.name}
            </span>{" "}
            will be delete forever
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteProduct}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function ProductTable() {
  const getProduct = useListProducts();
  const data = getProduct.data?.payload.data ?? [];
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [productIdEdit, setProductIdEdit] = useState<number | undefined>();
  const [productDelete, setProductDelete] = useState<ProductType | null>(null);
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
    <ProductTableContext.Provider
      value={{
        productDelete,
        setProductDelete,
        productIdEdit,
        setProductIdEdit,
      }}
    >
      <div className="w-full">
        <EditProduct
          id={productIdEdit}
          setId={setProductIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteProduct
          productDelete={productDelete}
          setProductDelete={setProductDelete}
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
            <AddProduct />
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
              pathname="/manage/product"
            />
          </div>
        </div>
      </div>
    </ProductTableContext.Provider>
  );
}
