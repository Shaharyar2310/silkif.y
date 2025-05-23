import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { 
  Moon, 
  Sun, 
  Menu, 
  Wand2, 
  Image as ImageIcon, 
  Sparkles, 
  ChevronDown, 
  Settings,
  Info,
  CreditCard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the homepage
  const isHomePage = location === "/";
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Silkify</h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <span className={`${location === '/' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'} hover:text-primary transition-colors font-medium cursor-pointer`}>Home</span>
          </Link>
          
          <Link href="/about">
            <span className={`${location === '/about' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'} hover:text-primary transition-colors font-medium cursor-pointer`}>About</span>
          </Link>
          
          {/* Tools Dropdown */}
          <div className="relative" ref={toolsDropdownRef}>
            <button 
              onClick={toggleToolsDropdown}
              className={`flex items-center space-x-1 ${(location === '/style-transfer' || location === '/image-enhancer' || location === '/prompt-generator') ? 'text-primary' : 'text-gray-700 dark:text-gray-200'} hover:text-primary transition-colors font-medium cursor-pointer`}
            >
              <span>Tools</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isToolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-[200px] z-50">
                <Link href="/style-transfer">
                  <div className={`flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${location === '/style-transfer' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <Wand2 className="h-4 w-4 text-primary" />
                    <span className="text-gray-700 dark:text-gray-200">Style Transfer</span>
                  </div>
                </Link>
                <Link href="/image-enhancer">
                  <div className={`flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${location === '/image-enhancer' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-gray-700 dark:text-gray-200">Image Enhancer</span>
                  </div>
                </Link>
                <Link href="/prompt-generator">
                  <div className={`flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${location === '/prompt-generator' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-gray-700 dark:text-gray-200">AI Image Generator</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/pricing">
            <span className={`${location === '/pricing' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'} hover:text-primary transition-colors font-medium cursor-pointer`}>Pricing</span>
          </Link>
          
          <Link href="/settings">
            <span className={`${location === '/settings' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'} hover:text-primary transition-colors font-medium cursor-pointer`}>Settings</span>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button 
              className="hidden md:flex bg-[hsl(var(--button-bg))] hover:bg-[hsl(var(--button-hover))] text-white font-medium rounded-lg px-4 py-2"
            >
              Sign In
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 dark:text-gray-200"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 py-4 px-6 border-t border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col space-y-4">
            <Link href="/">
              <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2">Home</span>
            </Link>
            
            <Link href="/about">
              <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2">About</span>
            </Link>
            
            {/* Mobile Tools Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 py-2">Tools</h3>
              <Link href="/style-transfer">
                <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2 pl-2">Style Transfer</span>
              </Link>
              <Link href="/image-enhancer">
                <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2 pl-2">Image Enhancer</span>
              </Link>
              <Link href="/prompt-generator">
                <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2 pl-2">AI Image Generator</span>
              </Link>
            </div>
            
            <Link href="/pricing">
              <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2">Pricing</span>
            </Link>
            
            <Link href="/settings">
              <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2">Settings</span>
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
              <Link href="/login">
                <span className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-medium cursor-pointer block py-2">Sign In</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}