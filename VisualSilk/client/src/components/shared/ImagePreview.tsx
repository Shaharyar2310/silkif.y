import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  isComparison?: boolean;
}

export default function ImagePreview({ 
  originalImage, 
  processedImage, 
  isProcessing,
  isComparison = false 
}: ImagePreviewProps) {
  const [compareValue, setCompareValue] = useState(50);
  
  useEffect(() => {
    if (isComparison && processedImage) {
      const afterImage = document.getElementById("afterImage") as HTMLImageElement;
      if (afterImage) {
        afterImage.style.clipPath = `inset(0 ${100 - compareValue}% 0 0)`;
      }
    }
  }, [compareValue, processedImage, isComparison]);

  if (!originalImage) {
    return null;
  }

  if (isComparison && processedImage) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="comparison-slider relative">
          <img
            id="beforeImage"
            src={originalImage}
            alt="Original image"
            className="before w-full h-auto max-h-[400px] object-contain"
          />
          <img
            id="afterImage"
            src={processedImage}
            alt="Processed image"
            className="after w-full h-auto max-h-[400px] object-contain absolute top-0 left-0"
            style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}
          />
          
          <Slider
            className="slider-input mt-2"
            defaultValue={[50]}
            value={[compareValue]}
            onValueChange={(values) => setCompareValue(values[0])}
            step={1}
            max={100}
            aria-label="Compare slider"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Processing your image...</p>
        </div>
      ) : (
        <img
          src={processedImage || originalImage}
          alt={processedImage ? "Processed image" : "Original image"}
          className="preview-img w-full h-auto max-h-[400px] object-contain"
        />
      )}
    </div>
  );
}
