import React from "react";
import { Upload, ChevronLeft } from "lucide-react";
import { useListingFormStore } from "@/app/stores/ListingFormStore";

interface UploadPhotoProps {
  onBack?: () => void;
}

const PhotoUpload: React.FC<UploadPhotoProps> = ({ onBack }) => {
  const { images, updateImages } = useListingFormStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const imageUrls = fileArray.map(file => URL.createObjectURL(file));
      updateImages(imageUrls);
    }
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
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#ececec] rounded-xl cursor-pointer hover:border-[#C9A227] hover:bg-gray-50 transition-all"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100">
              <Upload className="w-6 h-6 text-[#737780]" />
            </div>
            <p className="text-sm font-medium text-[#17181a]">Click to upload</p>
          </div>
          <input
            id="photo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#17181a] mb-3">
            {images.length} image(s) selected
          </p>
          <div className="grid grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-[#ececec]"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
