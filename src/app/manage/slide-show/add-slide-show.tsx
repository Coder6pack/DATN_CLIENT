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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import { useAddSlideShowMutation } from "@/app/queries/useSlideShow";
import {
  CreateSlideShowBodySchema,
  CreateSlideShowBodyType,
} from "@/schemaValidations/slide-show.model";

export default function AddSlideShow() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const addSlideShowMutation = useAddSlideShowMutation();
  const updateMediaMutation = useUploadFileMediaMutation();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateSlideShowBodyType>({
    resolver: zodResolver(CreateSlideShowBodySchema),
    defaultValues: {
      image: "",
    },
  });
  const image = form.watch("image")!;

  const previewAvatarFromFile = file ? URL.createObjectURL(file) : image;

  const reset = () => {
    form.reset({
      image: "",
    });
    setFile(null);
  };
  const onSubmit = async (values: CreateSlideShowBodyType) => {
    if (addSlideShowMutation.isPending) return;
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        const uploadImageResult = await updateMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data[0].url;
        console.log(imageUrl);
        body = {
          ...values,
          image: imageUrl,
        };
        const result = await addSlideShowMutation.mutateAsync(body);
        toast({
          description: "Add slideshow successfully",
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
            Create slide
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Create slide</DialogTitle>
          <DialogDescription>Field image is require</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-slide-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile!} />
                        <AvatarFallback className="rounded-none">
                          {image || "Image"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
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
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-slide-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
