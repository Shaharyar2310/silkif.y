import { useState } from "react";
import { useImages } from "@/hooks/useImages";
import ImageUploader from "@/components/shared/ImageUploader";
import ImagePreview from "@/components/shared/ImagePreview";
import RecentActivity from "@/components/shared/PremiumFeatures";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ImageEnhancer() {
  const { toast } = useToast();
  const {
    originalImage,
    isUploading,
    handleFileUpload,
  } = useImages();
  
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [denoise, setDenoise] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [bgRemove, setBgRemove] = useState(false);
  const [faceRetouch, setFaceRetouch] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  // Apply enhancements to image
  const enhanceImage = useMutation({
    mutationFn: async () => {
      if (!originalImage) return null;
      
      const res = await apiRequest("POST", "/api/images/enhance", {
        imageUrl: originalImage,
        settings: {
          brightness,
          contrast,
          sharpness,
          autoEnhance,
          denoise,
          upscale,
          bgRemove,
          faceRetouch
        }
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data) {
        setProcessedImage(data.processedUrl);
        toast({
          title: "Image enhanced",
          description: "Your image has been processed successfully",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Enhancement failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resetControls = () => {
    setBrightness(0);
    setContrast(0);
    setSharpness(0);
    setAutoEnhance(false);
    setDenoise(false);
    setUpscale(false);
    setBgRemove(false);
    setFaceRetouch(false);
    setProcessedImage(null);
  };
  
  const downloadImage = () => {
    if (!processedImage) {
      toast({
        title: "No processed image",
        description: "Please enhance your image first",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = `silkify-enhanced-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Image downloaded",
      description: "Your enhanced image has been downloaded",
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 hidden sm:block">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <a href="/style-transfer" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 rounded-t-lg">
              Style Transfer
            </a>
          </li>
          <li className="mr-2">
            <a href="#" className="inline-block p-4 border-b-2 border-primary text-primary rounded-t-lg active">
              Image Enhancer
            </a>
          </li>
          <li className="mr-2">
            <a href="/prompt-generator" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 rounded-t-lg">
              Prompt Generator
            </a>
          </li>
        </ul>
      </div>
      <div className="bg-card dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FFFFFF]">Image Enhancer</h2>
        
        <ImageUploader 
          isUploading={isUploading}
          onFileUpload={handleFileUpload}
        />
        
        {originalImage && (
          <>
            <div className="style-options mt-8">
              <div className="flex flex-col md:flex-row justify-center gap-6 flex-wrap">
                <div className="flex flex-col items-center">
                  <Label htmlFor="brightness" className="mb-2 font-semibold">Brightness</Label>
                  <Slider
                    id="brightness"
                    min={-100}
                    max={100}
                    step={1}
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    className="w-[120px]"
                  />
                  <span className="text-xs mt-1">{brightness}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Label htmlFor="contrast" className="mb-2 font-semibold">Contrast</Label>
                  <Slider
                    id="contrast"
                    min={-100}
                    max={100}
                    step={1}
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    className="w-[120px]"
                  />
                  <span className="text-xs mt-1">{contrast}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Label htmlFor="sharpness" className="mb-2 font-semibold">Sharpness</Label>
                  <Slider
                    id="sharpness"
                    min={0}
                    max={100}
                    step={1}
                    value={[sharpness]}
                    onValueChange={(value) => setSharpness(value[0])}
                    className="w-[120px]"
                  />
                  <span className="text-xs mt-1">{sharpness}</span>
                </div>
              </div>
              
              <div className="toggle-container mt-6 flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoEnhance"
                    checked={autoEnhance}
                    onCheckedChange={setAutoEnhance}
                  />
                  <Label htmlFor="autoEnhance">Auto Enhance</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="denoise"
                    checked={denoise}
                    onCheckedChange={setDenoise}
                  />
                  <Label htmlFor="denoise">Denoise</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="upscale"
                    checked={upscale}
                    onCheckedChange={setUpscale}
                  />
                  <Label htmlFor="upscale">AI Upscale</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bgRemove"
                    checked={bgRemove}
                    onCheckedChange={setBgRemove}
                  />
                  <Label htmlFor="bgRemove">Remove Background</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="faceRetouch"
                    checked={faceRetouch}
                    onCheckedChange={setFaceRetouch}
                  />
                  <Label htmlFor="faceRetouch">Face Retouch</Label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => enhanceImage.mutate()}
                  disabled={enhanceImage.isPending}
                  className="bg-buttonBg hover:bg-buttonActive text-white"
                >
                  {enhanceImage.isPending ? "Processing..." : "Enhance Image"}
                </Button>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <ImagePreview
                originalImage={originalImage}
                processedImage={processedImage}
                isProcessing={enhanceImage.isPending}
                isComparison={true}
              />
              
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <Button 
                  variant="outline" 
                  onClick={resetControls}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
                
                <Button 
                  onClick={downloadImage}
                  disabled={!processedImage}
                  className="px-5 py-2.5 bg-buttonBg hover:bg-buttonActive text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <RecentActivity />
    </div>
  );
}
