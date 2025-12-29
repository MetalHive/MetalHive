"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import FormField from "@/app/Components/FormField";
import { useListingFormStore } from "@/app/stores/ListingFormStore";

interface DescriptionProps {
  onBack?: () => void;
}

export default function Description({ onBack }: DescriptionProps) {
  const { description, additional_notes, updateDescription, updateAdditionalNotes } = useListingFormStore();
  const [errors, setErrors] = useState<{ description?: string }>({});

  return (
    <div className="max-w-xl mt-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#17181a] mb-6 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Add Description and Terms
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Describe your material and any terms of sale (pickup, delivery, or payment conditions).
      </p>

      {/* Description Textarea */}
      <FormField
        label="Description"
        placeholder="Enter details about your material, including purity, dimensions, pickup/delivery terms, and any special conditions..."
        type="textarea"
        value={description}
        onChange={(e) => updateDescription(e.target.value)}
        error={errors.description}
      />

      {/* Additional Notes Textarea */}
      <div className="mt-4">
        <FormField
          label="Additional Notes (Optional)"
          placeholder="e.g. Minimum order 100 kg, Forklift available for loading, Pickup between 9 AM - 5 PM"
          type="textarea"
          value={additional_notes}
          onChange={(e) => updateAdditionalNotes(e.target.value)}
        />
      </div>

      {/* Info */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>What to include:</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Material purity percentage</li>
          <li>Dimensions or weight details</li>
          <li>Delivery or pickup options</li>
          <li>Payment terms</li>
          <li>Any certifications or quality reports</li>
        </ul>
      </div>
    </div>
  );
}
