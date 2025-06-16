"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface AvatarUploadProps {
  currentAvatar: string;
  userName: string;
  onAvatarChange: (newAvatar: string) => void;
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, upload to server and get URL
      onAvatarChange(selectedImage);
      setIsOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setIsOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const predefinedAvatars = [
    "/placeholder.svg?height=120&width=120&text=Avatar1",
    "/placeholder.svg?height=120&width=120&text=Avatar2",
    "/placeholder.svg?height=120&width=120&text=Avatar3",
    "/placeholder.svg?height=120&width=120&text=Avatar4",
    "/placeholder.svg?height=120&width=120&text=Avatar5",
    "/placeholder.svg?height=120&width=120&text=Avatar6",
  ];

  return (
    <div className="relative inline-block">
      <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
        <AvatarImage src={currentAvatar || "/placeholder.svg"} alt={userName} />
        <AvatarFallback className="text-2xl font-bold bg-primary text-white">
          {userName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">
              Cập nhật ảnh đại diện
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current/Selected Avatar Preview */}
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto border-4 border-background shadow-lg">
                <AvatarImage
                  src={selectedImage || currentAvatar || "/placeholder.svg"}
                  alt={userName}
                />
                <AvatarFallback className="text-4xl font-bold bg-primary text-white">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Options */}
            <div className="space-y-4">
              {/* File Upload */}
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-card/50">
                <CardContent className="p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    className="text-center space-y-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Tải ảnh từ máy tính
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF tối đa 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Predefined Avatars */}
              <div>
                <p className="font-medium mb-3 text-foreground">
                  Hoặc chọn từ thư viện:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAvatars.map((avatar, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === avatar
                          ? "border-primary shadow-lg scale-105"
                          : "border-border hover:border-primary/50 hover:scale-105"
                      }`}
                      onClick={() => setSelectedImage(avatar)}
                    >
                      <Image
                        src={avatar || "/placeholder.svg"}
                        alt={`Avatar ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover"
                      />
                      {selectedImage === avatar && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 rounded-xl"
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedImage || uploading}
                className="flex-1 rounded-xl"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Cập nhật
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
