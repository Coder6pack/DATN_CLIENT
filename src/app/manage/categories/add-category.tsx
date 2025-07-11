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
import { PlusCircle, Send, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import { useAddCategoryMutation } from "@/app/queries/useCategory";
import {
  CreateCategoryBodySchema,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.model";

export default function AddCategory() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addCategoryMutation = useAddCategoryMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBodySchema),
    defaultValues: {
      name: "",
      logo: "",
      parentCategoryId: null,
    },
  });

  const name = form.watch("name");
  const previewAvatarFromFile = file ? URL.createObjectURL(file) : null;
  const reset = () => {
    form.reset();
    setFile(null);
  };
  const onSubmit = async (values: CreateCategoryBodyType) => {
    if (addCategoryMutation.isPending) return;
    setIsSubmitting(true);
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        const uploadImageResult = await updateMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data[0].url;
        body = {
          ...values,
          parentCategoryId: null,
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
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create category
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>Field name, logo is require</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-category-form"
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
                        <AvatarImage
                          src={previewAvatarFromFile || "/avatar.jpg"}
                        />
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-category-form"
            disabled={isSubmitting}
            className="px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {"Đang thêm..."}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {"Thêm"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
