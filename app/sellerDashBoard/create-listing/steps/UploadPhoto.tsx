import React, { useState } from "react";
import { Upload, ChevronLeft, X, Loader2 } from "lucide-react";
import { useListingFormStore } from "@/app/stores/ListingFormStore";
import { uploadMultipleImages } from "@/app/lib/api/services/imageUploadService";

interface UploadPhotoProps {
  onBack?: () => void;
}

const PhotoUpload: React.FC<UploadPhotoProps> = ({ onBack }) => {
  const { images, updateImages } = useListingFormStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress({ uploaded: 0, total: fileArray.length });

      try {
        const uploadedUrls = await uploadMultipleImages(
          fileArray,
          (uploaded, total) => {
            setUploadProgress({ uploaded, total });
          }
        );

        if (uploadedUrls.length > 0) {
          // Append new uploaded URLs to existing images
          updateImages([...images, ...uploadedUrls]);
        }

        if (uploadedUrls.length < fileArray.length) {
          setUploadError(`Only ${uploadedUrls.length} of ${fileArray.length} images uploaded successfully.`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
        setUploadProgress({ uploaded: 0, total: 0 });
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    updateImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#17181a] mb-8 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-[#17181a] mb-2">
        Add Photos of Your Material
      </h2>
      <p className="text-sm text-[#737780] mb-8">
        Upload clear images showing the metal's type, condition, and volume.
      </p>

      {/* Upload Photos Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#17181a] mb-3">
          Upload Photos
        </label>

        {/* Upload Area */}
        <label
          htmlFor="photo-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#ececec] rounded-xl cursor-pointer hover:border-[#C9A227] hover:bg-gray-50 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mb-3" />
                <p className="text-sm font-medium text-[#17181a]">
                  Uploading... {uploadProgress.uploaded}/{uploadProgress.total}
                </p>
                <p className="text-xs text-[#737780] mt-1">
                  Please wait while your images are being uploaded
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                  <Upload className="w-6 h-6 text-[#737780]" />
                </div>
                <p className="text-sm font-medium text-[#17181a]">Click to upload</p>
                <p className="text-xs text-[#737780] mt-1">PNG, JPG, GIF up to 32MB</p>
              </>
            )}
          </div>
          <input
            id="photo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {uploadError}
        </div>
      )}

      {/* Preview */}
      {images.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#17181a] mb-3">
            {images.length} image(s) uploaded
          </p>
          <div className="grid grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-[#ececec]"
                />
                {/* Remove button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
