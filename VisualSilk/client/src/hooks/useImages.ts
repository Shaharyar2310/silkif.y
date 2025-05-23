import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type StyleType = "Ghibli Art" | "Anime Pop" | "Sketch" | "Sci-Fi Neon" | null;

export interface ImageItem {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  style?: StyleType;
  createdAt: Date;
}

export function useImages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(null);

  // Fetch history from backend
  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["/api/images/history"],
  });

  // Upload image
  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setOriginalImage(data.url);
      setProcessedImage(null);
      setSelectedStyle(null);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Apply style to image
  const applyStyle = useMutation({
    mutationFn: async ({ imageUrl, style }: { imageUrl: string; style: StyleType }) => {
      const res = await apiRequest("POST", "/api/images/style", { imageUrl, style });
      return await res.json();
    },
    onSuccess: (data) => {
      setProcessedImage(data.processedUrl);
      queryClient.invalidateQueries({ queryKey: ["/api/images/history"] });
      toast({
        title: "Style applied",
        description: `Your image has been processed with ${selectedStyle} style`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Style application failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | { dataTransfer: { files: FileList } }) => {
      let files: FileList | null = null;
      
      if ('dataTransfer' in event) {
        files = event.dataTransfer.files;
      } else {
        files = event.target.files;
      }
      
      if (!files || files.length === 0) return;
      
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      uploadImage.mutate(file);
    },
    [toast, uploadImage]
  );

  // Apply style to current image
  const handleApplyStyle = useCallback(
    (style: StyleType) => {
      if (!originalImage) {
        toast({
          title: "No image selected",
          description: "Please upload an image first",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedStyle(style);
      applyStyle.mutate({ imageUrl: originalImage, style });
    },
    [originalImage, toast, applyStyle]
  );

  // Reset image to original
  const resetImage = useCallback(() => {
    setProcessedImage(null);
    setSelectedStyle(null);
    toast({
      title: "Image reset",
      description: "Your image has been reset to original",
    });
  }, [toast]);

  // Download processed image
  const downloadImage = useCallback(() => {
    if (!processedImage) {
      toast({
        title: "No processed image",
        description: "Please apply a style to your image first",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = `silkify-${selectedStyle?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Image downloaded",
      description: "Your processed image has been downloaded",
    });
  }, [processedImage, selectedStyle, toast]);

  return {
    originalImage,
    processedImage,
    selectedStyle,
    history,
    isHistoryLoading,
    isUploading: uploadImage.isPending,
    isProcessing: applyStyle.isPending,
    handleFileUpload,
    handleApplyStyle,
    resetImage,
    downloadImage,
  };
}
