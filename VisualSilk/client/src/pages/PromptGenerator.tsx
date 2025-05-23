import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RecentActivity from "@/components/shared/PremiumFeatures";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ExternalLink } from "lucide-react";

export default function PromptGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Generate image from prompt
  const generateImage = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/images/generate", { prompt });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl);
      toast({
        title: "Image generated",
        description: "Your image has been generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateImage = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }
    
    generateImage.mutate(prompt);
  };
  
  const downloadImage = () => {
    if (!generatedImage) return;
    
    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `silkify-generated-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Image downloaded",
      description: "Your generated image has been downloaded",
    });
  };
  
  const openImageInNewTab = () => {
    if (!generatedImage) return;
    window.open(generatedImage, "_blank");
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
            <a href="/image-enhancer" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 rounded-t-lg">
              Image Enhancer
            </a>
          </li>
          <li className="mr-2">
            <a href="#" className="inline-block p-4 border-b-2 border-primary text-primary rounded-t-lg active">
              Prompt Generator
            </a>
          </li>
        </ul>
      </div>
      <div className="bg-card dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FFFFFF]">AI Image Generator</h2>
        
        <div className="mb-6">
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
            Enter a detailed description of the image you want to generate
          </p>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A magical forest with glowing mushrooms and a small cottage in the distance..."
            className="w-full h-[100px] border-2 border-primary/60 rounded-xl bg-uploadBg dark:bg-uploadBgDark p-4 resize-none text-sm"
          />
          
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleGenerateImage}
              disabled={generateImage.isPending || !prompt.trim()}
              className="bg-buttonBg hover:bg-buttonActive text-white"
            >
              {generateImage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>
        </div>
        
        {(generateImage.isPending || generatedImage) && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">
              {generateImage.isPending ? "Generating image..." : "Generated Image"}
            </h3>
            
            <div className="output-area p-6 border-2 border-primary/60 rounded-xl bg-uploadBg dark:bg-uploadBgDark flex justify-center items-center">
              {generateImage.isPending ? (
                <div className="flex flex-col items-center py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Creating your masterpiece...
                  </p>
                </div>
              ) : generatedImage && (
                <div className="generated-output w-full">
                  <img
                    src={generatedImage}
                    alt="AI generated image"
                    className="max-w-full h-auto rounded-lg border-2 border-primary/20 mx-auto"
                  />
                  
                  <div className="flex justify-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={openImageInNewTab}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                    
                    <Button 
                      onClick={downloadImage}
                      className="bg-buttonBg hover:bg-buttonActive text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <RecentActivity />
    </div>
  );
}
