"use client";

import React, { useState } from "react";
import FormField from "@/app/Components/FormField";

export default function Description() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{ description?: string; quantity?: string }>({});

  return (
    <div className="max-w-xl mt-6">
      {/* Back Button */}
      <button className="flex items-center text-gray-500 mb-4">
        <span className="mr-2">←</span> Back
      </button>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Add Description and Terms
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Describe your material and any terms of sale (pickup, delivery, or payment conditions).
      </p>

      {/* Textarea */}
      <FormField
        label="Description"
        placeholder="Enter details about your material"
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      {/* Text Input */}
      <FormField
        label="Quantity"
        placeholder="Enter quantity, e.g., 200kg"
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        error={errors.quantity}
      />
    </div>
  );
}
