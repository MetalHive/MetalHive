import React, { useState } from "react";
import FormField from "@/app/Components/FormField";
import { useListingFormStore } from "@/app/stores/ListingFormStore";

export default function BasicDetails() {
  const {
    materialName,
    materialType,
    condition,
    quantity,
    quantityUnit,
    basePrice,
    priceUnit,
    location,
    updateBasicDetails
  } = useListingFormStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (newData: any) => {
    updateBasicDetails(newData);
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
          value={materialName}
          onChange={(e) => updateFormData({ materialName: e.target.value })}
          error={errors.materialName}
        />

        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Type
          </label>
          <select
            value={materialType}
            onChange={(e) => updateFormData({ materialType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select material type</option>
            <option value="Copper">Copper</option>
            <option value="Aluminium">Aluminium</option>
            <option value="Steel">Steel</option>
          </select>
          {errors.materialType && (
            <p className="text-sm text-red-500 mt-1">{errors.materialType}</p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => updateFormData({ condition: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select condition</option>
            <option value="Processed">Processed</option>
            <option value="Unprocessed">Unprocessed</option>
            <option value="Mixed">Mixed</option>
          </select>
          {errors.condition && (
            <p className="text-sm text-red-500 mt-1">{errors.condition}</p>
          )}
        </div>

        {/* Quantity — listed in the seller's own unit; the backend stores the
            kilogram equivalent for pricing and comparison. */}
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <FormField
              label="Estimated Weight"
              placeholder="e.g. 500"
              value={quantity}
              onChange={(e) => updateFormData({ quantity: e.target.value })}
              error={errors.quantity}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              value={quantityUnit}
              onChange={(e) => updateFormData({ quantityUnit: e.target.value as typeof quantityUnit })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="kg">Kilograms</option>
              <option value="tonne">Tonnes</option>
              <option value="g">Grams</option>
              <option value="lb">Pounds</option>
            </select>
          </div>
        </div>

        {/* Base Price */}
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <FormField
              label="Price"
              placeholder="e.g. 450"
              value={basePrice}
              onChange={(e) => updateFormData({ basePrice: e.target.value })}
              error={errors.basePrice}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Per</label>
            <select
              value={priceUnit}
              onChange={(e) => updateFormData({ priceUnit: e.target.value as typeof priceUnit })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="kg">Kilogram</option>
              <option value="tonne">Tonne</option>
              <option value="g">Gram</option>
              <option value="lb">Pound</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <FormField
          label="Location"
          placeholder="e.g. Ontario, Canada"
          value={location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          error={errors.location}
        />
      </div>
    </div>
  );
}
