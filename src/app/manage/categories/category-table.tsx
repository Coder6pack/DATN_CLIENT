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
import { CategoryType } from "@/schemaValidations/category.model";
import EditCategory from "./edit-category";
import AddCategory from "./add-category";
import {
  useDeleteCategoryMutation,
  useListCategories,
} from "@/app/queries/useCategory";
import AddCategoryChild from "./add-category-child";

const CategoryTableContext = createContext<{
  setCategoryIdEdit: (value: number) => void;
  categoryIdEdit: number | undefined;
  categoryDelete: CategoryType | null;
  setCategoryDelete: (value: CategoryType | null) => void;
}>({
  setCategoryIdEdit: (value: number | undefined) => {},
  categoryIdEdit: undefined,
  categoryDelete: null,
  setCategoryDelete: (value: CategoryType | null) => {},
});

export const columns: ColumnDef<CategoryType>[] = [
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
    accessorKey: "parentCategoryId",
    header: "Parent ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("parentCategoryId")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setCategoryIdEdit, setCategoryDelete } =
        useContext(CategoryTableContext);
      const openEditCategory = () => {
        setCategoryIdEdit(row.original.id);
      };

      const openDeleteCategory = () => {
        setCategoryDelete({
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
            <DropdownMenuItem onClick={openEditCategory}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteCategory}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteCategory({
  categoryDelete,
  setCategoryDelete,
}: {
  categoryDelete: CategoryType | null;
  setCategoryDelete: (value: CategoryType | null) => void;
}) {
  const { mutateAsync } = useDeleteCategoryMutation();
  const deleteCategory = async () => {
    if (categoryDelete) {
      try {
        const result = await mutateAsync(categoryDelete.id);
        setCategoryDelete(null);
        toast({
          title: "Delete category successfully",
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
      open={Boolean(categoryDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setCategoryDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa category?</AlertDialogTitle>
          <AlertDialogDescription>
            Category{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {categoryDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteCategory}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function CategoryTable() {
  const getCategories = useListCategories();
  const sortCategories = getCategories.data?.payload.data.sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );
  const data = sortCategories ?? [];
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [categoryIdEdit, setCategoryIdEdit] = useState<number | undefined>();
  const [categoryDelete, setCategoryDelete] = useState<CategoryType | null>(
    null
  );
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
    <CategoryTableContext.Provider
      value={{
        categoryDelete,
        setCategoryDelete,
        categoryIdEdit,
        setCategoryIdEdit,
      }}
    >
      <div className="w-full">
        <EditCategory
          id={categoryIdEdit}
          setId={setCategoryIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteCategory
          categoryDelete={categoryDelete}
          setCategoryDelete={setCategoryDelete}
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
            <AddCategory />
            <AddCategoryChild />
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
              pathname="/manage/category"
            />
          </div>
        </div>
      </div>
    </CategoryTableContext.Provider>
  );
}
