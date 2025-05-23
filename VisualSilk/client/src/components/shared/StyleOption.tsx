import { Loader2 } from "lucide-react";

interface StyleProps {
  style: {
    id: string;
    name: string;
    previewUrl: string;
  };
  isSelected: boolean;
  isProcessing: boolean;
  onSelectStyle: () => void;
}

export default function StyleOption({ style, isSelected, isProcessing, onSelectStyle }: StyleProps) {
  return (
    <button
      onClick={onSelectStyle}
      disabled={isProcessing}
      className={`p-3 rounded-lg ${
        isSelected 
          ? "bg-primary/20 dark:bg-primary/30" 
          : "bg-uploadBg dark:bg-uploadBgDark hover:bg-primary/10 dark:hover:bg-primary/10"
      } transition-colors duration-200 flex flex-col items-center gap-2`}
    >
      {isProcessing && isSelected ? (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <img
          src={style.previewUrl}
          alt={`${style.name} style preview`}
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}
      <span className="text-sm font-medium">{style.name}</span>
    </button>
  );
}
