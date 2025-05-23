import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  History, 
  Home, 
  ImageIcon, 
  Settings, 
  User, 
  Wand2, 
  Sparkles, 
  Info, 
  CreditCard 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleLogin = () => {
    if (isLoggedIn) {
      logout.mutate();
    } else {
      // Navigate to login page
      window.location.href = "/login";
    }
  };

  return (
    <aside className="fixed left-0 top-0 w-60 h-full bg-white dark:bg-gray-900 text-gray-700 dark:text-white flex flex-col justify-between z-20 transition-all duration-300 hidden md:flex shadow-md border-r border-gray-200 dark:border-gray-800">
      <div className="pt-20 p-6 overflow-y-auto flex-1">        
        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Navigation</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/about" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <Info className="h-4 w-4" />
                  <span>About</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/pricing">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/pricing" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <CreditCard className="h-4 w-4" />
                  <span>Pricing</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/settings" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
        
        {/* AI Tools Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">AI Tools</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/style-transfer">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/style-transfer" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <Wand2 className="h-4 w-4" />
                  <span>Style Transfer</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/image-enhancer">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/image-enhancer" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <ImageIcon className="h-4 w-4" />
                  <span>Image Enhancer</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/prompt-generator">
                <span className={`flex items-center gap-2 py-2 px-3 rounded-md ${location === "/prompt-generator" ? "bg-gray-100 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"} transition text-gray-700 dark:text-white`}>
                  <Sparkles className="h-4 w-4" />
                  <span>AI Image Generator</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300">
              <History className="h-4 w-4 text-gray-500" />
              <span>No recent activity</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-primary flex items-center justify-center font-bold text-sm">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-white">{isLoggedIn ? "User" : "Guest"}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isLoggedIn ? "Pro Plan" : "Free Plan"}</div>
          </div>
        </div>
        
        {/* Auth Buttons */}
        <Button
          onClick={toggleLogin}
          className="w-full mb-3 py-2 px-3 bg-primary hover:bg-[hsl(var(--button-hover))] text-white rounded-md font-medium transition flex items-center justify-center gap-2"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </Button>
      </div>
    </aside>
  );
}
