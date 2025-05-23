import { useState } from "react";
import { useImages } from "@/hooks/useImages";
import ImageUploader from "@/components/shared/ImageUploader";
import StyleOption from "@/components/shared/StyleOption";
import ImagePreview from "@/components/shared/ImagePreview";
import RecentActivity from "@/components/shared/PremiumFeatures";
import { Button } from "@/components/ui/button";
import { Share, RotateCcw, Download } from "lucide-react";

const styles = [
  {
    id: "ghibli",
    name: "Ghibli Art",
    previewUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "anime",
    name: "Anime Pop",
    previewUrl: "https://images.unsplash.com/photo-1613487957484-32c977a8bd62?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "sketch",
    name: "Sketch",
    previewUrl: "https://images.unsplash.com/photo-1502101872923-d48509bff386?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "neon",
    name: "Sci-Fi Neon",
    previewUrl: "https://pixabay.com/get/g578659ed33ab6ec6b38634d1fda3f749a0b4af8cb531d56fcb98e4e37644ecff7e7ac6fa279b52a48412f6f035247c62371d83dbde2373079fd94034aff439ee_1280.jpg",
  },
];

export default function StyleTransfer() {
  const {
    originalImage,
    processedImage,
    selectedStyle,
    isUploading,
    isProcessing,
    handleFileUpload,
    handleApplyStyle,
    resetImage,
    downloadImage,
  } = useImages();
  
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleShare = () => {
    if (navigator.share && processedImage) {
      navigator.share({
        title: "Shared from Silkify",
        text: "Check out this image I created with Silkify!",
        url: processedImage,
      }).catch(() => {
        setShowShareOptions(true);
      });
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 hidden sm:block">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <a href="#" className="inline-block p-4 border-b-2 border-primary text-primary rounded-t-lg active">
              Style Transfer
            </a>
          </li>
          <li className="mr-2">
            <a href="/image-enhancer" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 rounded-t-lg">
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
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ffffffFF]">Style Transfer</h2>
        
        <ImageUploader 
          isUploading={isUploading}
          onFileUpload={handleFileUpload}
        />
        
        {originalImage && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Select Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styles.map((style) => (
                <StyleOption
                  key={style.id}
                  style={style}
                  isSelected={selectedStyle === style.name}
                  isProcessing={isProcessing}
                  onSelectStyle={() => handleApplyStyle(style.name)}
                />
              ))}
            </div>
          </div>
        )}
        
        {(originalImage || processedImage) && (
          <div className="mt-10">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <ImagePreview
              originalImage={originalImage}
              processedImage={processedImage}
              isProcessing={isProcessing}
            />
            
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <Button 
                variant="outline" 
                onClick={resetImage}
                disabled={!processedImage}
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
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                disabled={!processedImage}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Share className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
      <RecentActivity />
    </div>
  );
}
