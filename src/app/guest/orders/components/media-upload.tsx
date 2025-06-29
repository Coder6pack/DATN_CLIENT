"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Upload,
  X,
  ImageIcon,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

// MediaFile for new uploads (with File object)
export interface MediaFile {
  type: MediaType;
  file: File;
  previewUrl?: string; // For local preview only
}

// ExistingMedia for already uploaded files (with URL only)
export interface ExistingMedia {
  type: MediaType;
  url: string;
}

// Union type for both cases
export type MediaItem = MediaFile | ExistingMedia;

// Type guard to check if item is MediaFile
export const isMediaFile = (item: MediaItem): item is MediaFile => {
  return "file" in item;
};

// Type guard to check if item is ExistingMedia
export const isExistingMedia = (item: MediaItem): item is ExistingMedia => {
  return "url" in item && !("file" in item);
};

interface MediaUploadProps {
  value: MediaItem[];
  onChange: (medias: MediaItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

export default function MediaUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxFileSize = 10,
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (value.length + files.length > maxFiles) {
      alert(`Chỉ có thể tải lên tối đa ${maxFiles} file`);
      return;
    }

    setUploading(true);
    const newMedias: MediaFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(
          `File ${file.name} quá lớn. Kích thước tối đa là ${maxFileSize}MB`
        );
        continue;
      }

      // Check file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert(
          `File ${file.name} không được hỗ trợ. Chỉ chấp nhận ảnh và video`
        );
        continue;
      }

      try {
        // Create preview URL for display only
        const previewUrl = URL.createObjectURL(file);

        newMedias.push({
          type: isImage ? MediaType.IMAGE : MediaType.VIDEO,
          file,
          previewUrl,
        });
      } catch (error) {
        console.error("Error processing file:", error);
        alert(`Có lỗi khi xử lý file ${file.name}`);
      }
    }

    // Call onChange with updated medias
    onChange([...value, ...newMedias]);
    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeMedia = (index: number) => {
    const mediaToRemove = value[index];
    // Clean up preview URL if it's a MediaFile
    if (isMediaFile(mediaToRemove) && mediaToRemove.previewUrl) {
      URL.revokeObjectURL(mediaToRemove.previewUrl);
    }
    const newMedias = value.filter((_, i) => i !== index);
    onChange(newMedias);
  };

  const getDisplayUrl = (item: MediaItem): string => {
    if (isMediaFile(item)) {
      return item.previewUrl || "/placeholder.svg";
    } else {
      return item.url || "/placeholder.svg";
    }
  };

  const getFileName = (item: MediaItem): string => {
    if (isMediaFile(item)) {
      return item.file.name;
    } else {
      // Extract filename from URL or use default
      const urlParts = item.url.split("/");
      return urlParts[urlParts.length - 1] || "uploaded-file";
    }
  };

  const getFileSize = (item: MediaItem): number => {
    if (isMediaFile(item)) {
      return item.file.size;
    } else {
      return 0; // Unknown size for existing files
    }
  };

  const toggleVideoPlay = (url: string) => {
    setPlayingVideo(playingVideo === url ? null : url);
  };

  const toggleVideoMute = (url: string) => {
    const newMutedVideos = new Set(mutedVideos);
    if (newMutedVideos.has(url)) {
      newMutedVideos.delete(url);
    } else {
      newMutedVideos.add(url);
    }
    setMutedVideos(newMutedVideos);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  const totalSize = value.reduce((total, item) => total + getFileSize(item), 0);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary hover:bg-muted/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <Upload
              className={`h-10 w-10 ${
                dragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {uploading ? "Đang xử lý..." : "Thêm ảnh hoặc video"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file • Tối đa {maxFiles} file • Mỗi
              file không quá {maxFileSize}MB
            </p>
          </div>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <ImageIcon className="h-3 w-3" />
              <span>JPG, PNG, GIF</span>
            </span>
            <span className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>MP4, MOV, AVI</span>
            </span>
          </div>
        </div>
      </div>

      {/* Media Preview */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              File đã chọn ({value.length}/{maxFiles})
            </h4>
            <p className="text-xs text-muted-foreground">
              Tổng dung lượng: {formatFileSize(totalSize)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {value.map((media, index) => {
              const displayUrl = getDisplayUrl(media);
              const fileName = getFileName(media);

              return (
                <Card key={index} className="relative group overflow-hidden">
                  <CardContent className="p-0">
                    {media.type === MediaType.IMAGE ? (
                      <div className="aspect-square relative">
                        <img
                          src={displayUrl || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {getFileExtension(fileName)}
                        </Badge>
                        {isExistingMedia(media) && (
                          <Badge
                            variant="outline"
                            className="absolute top-2 right-8 text-xs bg-green-100 text-green-800"
                          >
                            Đã tải lên
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-square relative">
                        <video
                          src={displayUrl}
                          className="w-full h-full object-cover"
                          muted={mutedVideos.has(displayUrl)}
                          loop
                          playsInline
                          ref={(el) => {
                            if (el) {
                              if (playingVideo === displayUrl) {
                                el.play();
                              } else {
                                el.pause();
                              }
                            }
                          }}
                        />
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          {getFileExtension(fileName)}
                        </Badge>
                        {isExistingMedia(media) && (
                          <Badge
                            variant="outline"
                            className="absolute top-2 right-8 text-xs bg-green-100 text-green-800"
                          >
                            Đã tải lên
                          </Badge>
                        )}

                        {/* Video Controls */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoPlay(displayUrl);
                            }}
                          >
                            {playingVideo === displayUrl ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoMute(displayUrl);
                            }}
                          >
                            {mutedVideos.has(displayUrl) ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* File Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-xs font-medium truncate">{fileName}</p>
                      <p className="text-xs text-gray-300">
                        {formatFileSize(getFileSize(media))}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* File List View */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground">
              Danh sách file:
            </h5>
            {value.map((media, index) => {
              const fileName = getFileName(media);
              const fileSize = getFileSize(media);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {media.type === MediaType.IMAGE ? (
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Video className="h-4 w-4 text-purple-500" />
                    )}
                    <span className="font-medium truncate max-w-[200px]">
                      {fileName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getFileExtension(fileName)}
                    </Badge>
                    {isExistingMedia(media) && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        Đã tải lên
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(fileSize)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
