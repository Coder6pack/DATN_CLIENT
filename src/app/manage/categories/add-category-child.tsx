"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import {
  useAddCategoryMutation,
  useListCategories,
} from "@/app/queries/useCategory";
import {
  CreateCategoryBodySchema,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddCategoryChild() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const addCategoryMutation = useAddCategoryMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const { data: listCategories } = useListCategories();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBodySchema),
    defaultValues: {
      name: "",
      logo: "",
      parentCategoryId: null,
    },
  });
  if (!listCategories) {
    return;
  }
  const categories = listCategories.payload.data
    .filter((category) => category.parentCategoryId === null)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
    );
  const name = form.watch("name");
  const previewAvatarFromFile = file ? URL.createObjectURL(file) : null;
  const reset = () => {
    form.reset({
      logo: "",
      name: "",
      parentCategoryId: null,
    });
    setFile(null);
  };
  const onSubmit = async (values: CreateCategoryBodyType) => {
    if (addCategoryMutation.isPending) return;
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        const uploadImageResult = await updateMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data[0].url;
        console.log(selectedValue);
        body = {
          ...values,
          parentCategoryId: selectedValue,
          logo: imageUrl,
        };

        const result = await addCategoryMutation.mutateAsync(body);
        toast({
          description: "Create category successfully",
        });
        setOpen(false);
        reset();
      }
    } catch (error) {
      handleHttpErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create child
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>Field name, logo is require</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-category-child-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile!} />
                        <AvatarFallback className="rounded-none">
                          {name || "Logo"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={logoInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Name</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Select
                        value={
                          selectedValue != null ? String(selectedValue) : ""
                        }
                        onValueChange={(value) =>
                          setSelectedValue(value ? Number(value) : null)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chose parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cate, index) => (
                            <SelectItem key={index} value={cate.id.toString()}>
                              {cate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button type="submit" form="add-category-child-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
