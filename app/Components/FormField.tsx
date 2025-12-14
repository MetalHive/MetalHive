import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface FormFieldProps {
  label: string;
  type?: string; // 'text', 'password', 'select', 'file', 'textarea', etc.
  placeholder?: string;
  value?: string | number | File[]; // accept files too
  error?: string;
  options?: string[]; // for select fields
  multiple?: boolean; // for file inputs
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  error,
  options,
  multiple = false,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600 mb-4">
      <div className="mb-2 text-lg pt-2 pl-2 font-medium">{label}</div>
      <div className="bg-white p-4 relative rounded-2xl">
        {type === "select" && options ? (
          <select
            value={value as string | number}
            onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#C9A227]"
            }`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "file" ? (
          <input
            type="file"
            multiple={multiple}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
          />
        ) : type === "textarea" ? (
          <textarea
            placeholder={placeholder}
            value={value as string}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none h-40 focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#C9A227]"
            }`}
          />
        ) : (
          <input
            type={label === "Password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            value={value as string | number}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#C9A227]"
            }`}
          />
        )}

        {label === "Password" && type !== "select" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default FormField;
