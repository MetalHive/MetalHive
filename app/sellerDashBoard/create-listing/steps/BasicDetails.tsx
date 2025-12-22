import React, { useState } from "react";
import FormField from "@/app/Components/FormField"; // your reusable FormField component

export default function BasicDetails() {
  const [formData, setFormData] = useState({
    materialName: "",
    materialType: "",
    condition: "",
    quantity: "",
    basePrice: "",
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...newData });
  };

  return (
    <div className="max-w-xl">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Create a New Listing
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Add details about the material you want to sell. Clear, complete listings attract more verified buyers.
      </p>

      {/* Form */}
      <div className="space-y-4">
        {/* Material Name */}
        <FormField
          label="Material Name"
          placeholder="e.g. Copper Scrap"
          value={formData.materialName}
          onChange={(e) => updateFormData({ materialName: e.target.value })}
          error={errors.materialName}
        />

        {/* Material Type */}
        <FormField
          label="Material Type"
          type="select"
          value={formData.materialType}
          onChange={(e) => updateFormData({ materialType: e.target.value })}
          error={errors.materialType}
          options={["Copper", "Aluminium", "Steel"]}
        />

        {/* Condition */}
        <FormField
          label="Condition"
          type="select"
          value={formData.condition}
          onChange={(e) => updateFormData({ condition: e.target.value })}
          error={errors.condition}
          options={["Processed", "Unprocessed", "Mixed"]}
        />

        {/* Quantity */}
        <FormField
          label="Quantity"
          placeholder="e.g. 200kg"
          value={formData.quantity}
          onChange={(e) => updateFormData({ quantity: e.target.value })}
          error={errors.quantity}
        />

        {/* Base Price */}
        <FormField
          label="Base Price"
          placeholder="e.g. $500 per tonne"
          value={formData.basePrice}
          onChange={(e) => updateFormData({ basePrice: e.target.value })}
          error={errors.basePrice}
        />

        {/* Location */}
        <FormField
          label="Location"
          placeholder="e.g. Manchester"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          error={errors.location}
        />
      </div>
    </div>
  );
}
