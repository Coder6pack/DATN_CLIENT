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
import { SlideShowType } from "@/schemaValidations/slide-show.model";
import {
  useDeleteSlideShowMutation,
  useListSlideShow,
} from "@/app/queries/useSlideShow";
import AddSlideShow from "./add-slide-show";

const SlideShowTableContext = createContext<{
  setSlideShowIdEdit: (value: number) => void;
  slideShowIdEdit: number | undefined;
  slideShowDelete: SlideShowType | null;
  setSlideShowDelete: (value: SlideShowType | null) => void;
}>({
  setSlideShowIdEdit: (value: number | undefined) => {},
  slideShowIdEdit: undefined,
  slideShowDelete: null,
  setSlideShowDelete: (value: SlideShowType | null) => {},
});

export const columns: ColumnDef<SlideShowType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage
            src={row.getValue("image")}
            width={"100px"}
            height={"100px"}
          />
          <AvatarFallback className="rounded-none">
            {row.original.image}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setSlideShowDelete } = useContext(SlideShowTableContext);
      const openDeleteSlideshow = () => {
        setSlideShowDelete({
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
            <DropdownMenuItem onClick={openDeleteSlideshow}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteSlideshow({
  slideShowDelete,
  setSlideShowDelete,
}: {
  slideShowDelete: SlideShowType | null;
  setSlideShowDelete: (value: SlideShowType | null) => void;
}) {
  const { mutateAsync } = useDeleteSlideShowMutation();
  const deleteSlideShow = async () => {
    if (slideShowDelete) {
      try {
        const result = await mutateAsync(slideShowDelete.id);
        setSlideShowDelete(null);
        toast({
          title: "Delete slide show successfully",
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
      open={Boolean(slideShowDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setSlideShowDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete slideshow? </AlertDialogTitle>
          <AlertDialogDescription>
            Slideshow{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {slideShowDelete?.id}
            </span>{" "}
            will be delete forever!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteSlideShow}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function SlideShowTable() {
  const getSlideShows = useListSlideShow();
  const data = getSlideShows.data?.payload.data ?? [];
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [slideShowIdEdit, setSlideShowIdEdit] = useState<number | undefined>();
  const [slideShowDelete, setSlideShowDelete] = useState<SlideShowType | null>(
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
    <SlideShowTableContext.Provider
      value={{
        slideShowIdEdit,
        setSlideShowIdEdit,
        slideShowDelete,
        setSlideShowDelete,
      }}
    >
      <div className="w-full">
        <AlertDialogDeleteSlideshow
          slideShowDelete={slideShowDelete}
          setSlideShowDelete={setSlideShowDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter id..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddSlideShow />
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
              pathname="/manage/slide-show"
            />
          </div>
        </div>
      </div>
    </SlideShowTableContext.Provider>
  );
}
