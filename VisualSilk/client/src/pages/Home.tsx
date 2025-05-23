import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2, Image as ImageIcon, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="flex flex-col items-center text-center py-32 px-6 justify-center bg-cover bg-center bg-no-repeat rounded-b-3xl shadow-lg"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')"
        }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-5 text-white leading-tight">
          Seamless Creativity <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">For Your Digital Needs</span>
        </h2>
        <p className="text-lg max-w-[600px] mb-8 text-gray-200">
          Silkify simplifies the process, enhances creativity, and delivers smooth, elegant user experiences tailored for the best outcomes.
        </p>
        <Link href="/style-transfer">
          <Button 
            className="bg-[hsl(var(--button-bg))] hover:bg-[hsl(var(--button-hover))] text-white px-8 py-4 text-lg font-medium rounded-xl 
            shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-[#b197fc] focus:outline-offset-2"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Transform Your Images with AI
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our powerful tools help you enhance, stylize, and generate images in seconds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Wand2 className="h-16 w-16 text-primary" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Style Transfer</h4>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Transform your photos with various artistic styles including anime, sketch, and more.
              </p>
              <Link href="/style-transfer">
                <span className="inline-flex items-center text-primary font-medium hover:underline cursor-pointer">
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
          
          {/* Feature Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-primary" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Image Enhancer</h4>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Improve image quality with AI tools for lighting, color adjustment, and denoising.
              </p>
              <Link href="/image-enhancer">
                <span className="inline-flex items-center text-primary font-medium hover:underline cursor-pointer">
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
          
          {/* Feature Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">AI Image Generator</h4>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Create stunning images from text descriptions using our advanced AI image generation.
              </p>
              <Link href="/prompt-generator">
                <span className="inline-flex items-center text-primary font-medium hover:underline cursor-pointer">
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <p>&copy; 2025 Silkify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
