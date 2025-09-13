import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadStep } from "./image-upload-step";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { authApiClient } from "@/api-config";
import { useMutation } from "@tanstack/react-query";
import type { Competition } from "../../type";

interface UploadedImage {
  file: File;
  preview: string;
  stepId: string;
}

export function UploadProof({ competition }: { competition: Competition }) {
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Only steps where stepVerification === true
  const verificationSteps = competition.rules.filter(
    (rule) => rule.stepVerification
  );

  const handleImagesChange = (stepId: string, newImages: UploadedImage[]) => {
    setImages((prev) => [
      ...prev.filter((img) => img.stepId !== stepId),
      ...newImages,
    ]);
  };

  const getStepImages = (stepId: string) => {
    return images.filter((img) => img.stepId === stepId);
  };

  async function handleSubmitUpload() {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append("images", image.file);
      formData.append("stepIds", image.stepId);
    });

    formData.append(
      "steps",
      JSON.stringify(
        verificationSteps.map((step) => ({
          id: step._id,
          description: step.description,
          imageCount: getStepImages(step._id).length,
        }))
      )
    );

    const res = await authApiClient.post(
      `top-score/upload-proof/${competition._id}`,
      formData
    );
    return res.data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmitUpload,
    onSuccess: () => {
      toast.success("Competition created successfully!");
    },
    onError: (error) => {
      toast.error("Error creating competition:");
      console.log(error);
    },
  });

  const totalImages = images.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Proof for Steps</CardTitle>
          <p className="text-muted-foreground">
            Only steps marked for verification require images.
          </p>
          <p className="text-sm text-muted-foreground">
            {totalImages} image{totalImages !== 1 ? "s" : ""} uploaded total
          </p>
        </CardHeader>
      </Card>

      <div className="flex flex-col space-y-6">
        {verificationSteps.map((step) => (
          <Card key={step._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step.description} <span className="text-red-500">*</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Step {step.step} requires verification
              </p>
            </CardHeader>
            <CardContent>
              <ImageUploadStep
                stepId={step._id}
                images={getStepImages(step._id)}
                onImagesChange={(newImages) =>
                  handleImagesChange(step._id, newImages)
                }
                required={true}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => mutate()}
          disabled={isPending || totalImages === 0}
          className="flex items-center gap-2"
          size="lg"
        >
          <Upload className="w-4 h-4" />
          {isPending ? "Uploading..." : `Upload Proof (${totalImages})`}
        </Button>
      </div>
    </div>
  );
}
