import { Link } from "wouter";
import { Info, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecentActivity() {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-2">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Information</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          This feature uses AI technology to transform your images. For best results, use high-quality images and explore different settings.
        </p>
        
        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Need more options?</h4>
          <Link href="/pricing">
            <Button className="bg-primary hover:bg-[hsl(var(--button-hover))] text-white w-full flex items-center gap-2 justify-center">
              <CreditCard className="w-4 h-4" />
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Recent Creations</h4>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          <p>No recent activity</p>
          <p className="text-xs mt-1">Your processed images will appear here</p>
        </div>
      </div>
    </div>
  );
}
