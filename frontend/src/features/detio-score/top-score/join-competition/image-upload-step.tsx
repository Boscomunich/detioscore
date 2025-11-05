import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageUploadStepProps, UploadedImage } from "@/types/competition";

export function ImageUploadStep({
  stepId,
  images,
  onImagesChange,
  required,
}: ImageUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Size restriction: 2MB max
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        alert("File size exceeds 2 MB. Please choose a smaller image.");
        return;
      }

      const newImage: UploadedImage = {
        file,
        preview: URL.createObjectURL(file),
        stepId,
      };
      onImagesChange([newImage]); // Replace any existing image
    },
    [onImagesChange, stepId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false, // only allow single file
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeImage = () => {
    onImagesChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive || dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          images.length === 0 && required && "border-red-300"
        )}
      >
        <CardContent className="p-4">
          <div {...getRootProps()} className="text-center">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center",
                  isDragActive || dragActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <Upload className="size-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  {isDragActive ? "Drop image here" : "Upload Image"}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: JPEG, PNG, GIF, WebP
                </p>
              </div>

              <Button type="button" variant="secondary">
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {images.length === 1 && (
        <Card className="relative group overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square relative flex justify-center items-center">
              <img
                src={images[0].preview || "/placeholder.svg"}
                alt="Uploaded"
                className="w-48 h-48 object-cover"
              />

              {/* Remove Button */}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* File Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs truncate">{images[0].file.name}</p>
                <p className="text-xs text-gray-300">
                  {(images[0].file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Field Message */}
      {required && images.length === 0 && (
        <p className="text-sm text-red-600">
          This step requires an image to continue.
        </p>
      )}
    </div>
  );
}
