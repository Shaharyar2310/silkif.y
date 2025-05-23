import { useRef } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement> | { dataTransfer: { files: FileList } }) => void;
}

export default function ImageUploader({ isUploading, onFileUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
    e.currentTarget.classList.remove("border-primary/60");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    e.currentTarget.classList.add("border-primary/60");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    e.currentTarget.classList.add("border-primary/60");

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    onFileUpload({ dataTransfer: { files } });
  };

  return (
    <>
      <label
        htmlFor="imageUpload"
        className="block w-full p-8 border-2 border-dashed border-primary/60 rounded-xl bg-uploadBg dark:bg-uploadBgDark cursor-pointer text-center hover:border-primary transition-colors duration-200 select-none"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-10 h-10 text-primary" />
          <div>
            <p className="font-medium text-primary">
              {isUploading ? "Uploading..." : "Drag & Drop or Click to Upload"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Supports JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        id="imageUpload"
        accept="image/*"
        className="sr-only"
        onChange={onFileUpload}
        disabled={isUploading}
      />
    </>
  );
}
