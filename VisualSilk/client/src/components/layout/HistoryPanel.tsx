import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface HistoryItem {
  id: string;
  thumbnailUrl: string;
  style: string;
  createdAt: string;
}

export default function HistoryPanel() {
  const { toast } = useToast();
  
  const { data: historyItems = [], isLoading, refetch } = useQuery<HistoryItem[]>({
    queryKey: ["/api/images/history"],
  });
  
  const clearHistory = async () => {
    try {
      await apiRequest("DELETE", "/api/images/history", {});
      refetch();
      toast({
        title: "History cleared",
        description: "Your image history has been cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error clearing history",
        description: "There was a problem clearing your history",
        variant: "destructive",
      });
    }
  };
  
  const handleItemClick = (item: HistoryItem) => {
    // Implement loading this history item logic
    toast({
      title: "History item selected",
      description: `Loading ${item.style} from history`,
    });
  };

  return (
    <aside className="fixed right-0 top-0 w-60 h-full bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transition-colors duration-300 hidden lg:block">
      <h3 className="text-lg font-bold mb-4 text-primary">History</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No history items yet</p>
          <p className="text-sm mt-2">Your processed images will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            >
              <img
                src={item.thumbnailUrl}
                alt={`Thumbnail of ${item.style}`}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.style}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {historyItems.length > 0 && (
        <Button
          onClick={clearHistory}
          variant="outline"
          className="w-full mt-6 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Clear History
        </Button>
      )}
    </aside>
  );
}
