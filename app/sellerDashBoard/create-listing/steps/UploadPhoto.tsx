import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import FormField from "@/app/Components/FormField";

const PhotoUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ files?: string }>({});

  // Widen the event type to match FormField
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-xl mt-6">
      {/* Back Button */}
      <button className="flex items-center text-gray-500 mb-4">
        <span className="mr-2">←</span> Back
      </button>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Add Photos of Your Material
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload clear images showing the metal’s type, condition, and volume.
      </p>

      {/* Upload Box */}
      <label className="flex flex-col items-center justify-center border rounded-lg bg-gray-50 p-4 cursor-pointer text-gray-600 hover:text-gray-800 mb-6">
        <AiOutlineCloudUpload size={24} className="mb-2" />
        <span>Click to upload</span>

        {/* File input via FormField */}
        <FormField
          label=""
          type="file"
          multiple
          value={files}
          onChange={handleFileChange}
          error={errors.files}
        />
      </label>

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden text-xs text-gray-500"
            >
              {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
