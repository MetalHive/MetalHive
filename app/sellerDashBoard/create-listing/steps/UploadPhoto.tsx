import React, { useState } from "react";
import { Upload, ChevronLeft, X, Loader2 } from "lucide-react";
import { useListingFormStore } from "@/app/stores/ListingFormStore";
import { uploadMultipleImages } from "@/app/lib/api/services/imageUploadService";

const MAX_IMAGES = 10;

interface UploadPhotoProps {
  onBack?: () => void;
  /** Validation error from the wizard (e.g. no image uploaded yet). */
  error?: string;
}

const PhotoUpload: React.FC<UploadPhotoProps> = ({ onBack, error }) => {
  const { images, updateImages } = useListingFormStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files || input.files.length === 0) return;

    let fileArray = Array.from(input.files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setUploadError(`You can upload at most ${MAX_IMAGES} photos.`);
      input.value = '';
      return;
    }
    if (fileArray.length > remaining) {
      fileArray = fileArray.slice(0, remaining);
      setUploadError(`Only the first ${remaining} file(s) were uploaded; listings allow ${MAX_IMAGES} photos.`);
    } else {
      setUploadError(null);
    }

    setIsUploading(true);
    setUploadProgress({ uploaded: 0, total: fileArray.length });

    try {
      const result = await uploadMultipleImages(
        fileArray,
        (uploaded, total) => {
          setUploadProgress({ uploaded, total });
        }
      );

      if (result.urls.length > 0) {
        // Append new uploaded URLs to existing images
        updateImages([...images, ...result.urls]);
      }

      if (result.error) {
        // Surface the real reason (backend message) rather than a generic one.
        setUploadError(
          result.urls.length < fileArray.length
            ? `${result.urls.length} of ${fileArray.length} image(s) uploaded. ${result.error}`
            : result.error
        );
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress({ uploaded: 0, total: 0 });
      // Allow re-selecting the same file after a failure.
      input.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    updateImages(images.filter((_, index) => index !== indexToRemove));
  };

  const message = uploadError || error;

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
        Upload clear images showing the metal&apos;s type, condition, and volume. At least one photo is required.
      </p>

      {/* Upload Photos Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#17181a] mb-3">
          Upload Photos
        </label>

        {/* Upload Area */}
        <label
          htmlFor="photo-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer hover:border-[#C9A227] hover:bg-gray-50 transition-all ${
            error && !uploadError ? 'border-red-300' : 'border-[#ececec]'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <p className="text-xs text-[#737780] mt-1">PNG, JPG, GIF — up to {MAX_IMAGES} photos</p>
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
      {message && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {message}
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
              <div key={`${url}-${index}`} className="relative aspect-square group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-[#ececec]"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
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
