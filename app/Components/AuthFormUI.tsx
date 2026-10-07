"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IoArrowBack } from "react-icons/io5"
import { MdVisibility } from "react-icons/md"

/**
 * Shared building blocks for the seller / buyer registration flow.
 * Styled to match the Figma "User Registration" frames.
 */

/* ---------- page shell ---------- */

export const AuthShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-white">
    <header className="flex h-24 items-center px-4 md:px-[70px]">
      <Link href="/" className="inline-flex items-center">
        <Image
          src="/logoBlack.png"
          alt="MetalHive"
          width={110}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </Link>
    </header>
    <main className="mx-auto w-full max-w-[649px] px-4 pb-16 pt-[33px]">
      {children}
    </main>
  </div>
)

/* ---------- back button + heading ---------- */

export const BackButton = ({
  onClick,
  disabled,
}: {
  onClick?: () => void
  disabled?: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex h-7 w-fit shrink-0 items-center gap-2 self-start rounded-full border border-[#D8D8D8] bg-white pl-2 pr-3 text-sm leading-5 tracking-[0.14px] text-[#737780] transition hover:bg-[#F6F6F6] disabled:opacity-50"
  >
    <IoArrowBack size={16} />
    <span>Back</span>
  </button>
)

export const AuthHeading = ({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) => (
  <div className="flex flex-col gap-1">
    <h2 className="text-xl font-semibold leading-6 text-[#17181A]">{title}</h2>
    {subtitle && (
      <p className="text-base leading-6 tracking-[0.16px] text-[#737780]">
        {subtitle}
      </p>
    )}
  </div>
)

/* ---------- field card (grey label strip + white body) ---------- */

export const FieldCard = ({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) => (
  <div className="w-full">
    <div className="h-[70px] rounded-2xl bg-[#F6F6F6] px-4 py-3">
      <p className="text-sm font-medium leading-5 text-[#17181A]">
        {label}
        {hint && (
          <span className="font-normal tracking-[0.14px] text-[#737780]">
            {" "}
            {hint}
          </span>
        )}
      </p>
    </div>
    <div className="relative -mt-[26px] rounded-2xl border border-[#EBEBEB] bg-white p-4">
      {children}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
)

/* ---------- inputs ---------- */

export const inputClass = (hasError?: boolean) =>
  `h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm leading-5 tracking-[0.14px] text-[#2E3033] placeholder:text-[#ACACAC] outline-none transition focus:border-[#C9A227] disabled:opacity-50 ${
    hasError ? "border-red-500" : "border-[#EAEAEA]"
  }`

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export const TextInput = ({ hasError, className = "", ...props }: InputProps) => (
  <input {...props} className={`${inputClass(hasError)} ${className}`} />
)

export const PasswordInput = ({ hasError, className = "", ...props }: InputProps) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`${inputClass(hasError)} pr-11 ${className}`}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-[#2E3033]"
      >
        {show ? (
          <MdVisibility size={24} />
        ) : (
          <Image src="/icons/eye-off.svg" alt="" width={24} height={24} />
        )}
      </button>
    </div>
  )
}

export const PhoneInput = ({ hasError, className = "", ...props }: InputProps) => (
  <div
    className={`flex h-11 w-full items-center gap-2 rounded-xl border bg-white px-3 transition focus-within:border-[#C9A227] ${
      hasError ? "border-red-500" : "border-[#EAEAEA]"
    }`}
  >
    <span className="flex shrink-0 items-baseline gap-1 text-sm font-semibold leading-4 text-[#2E3033]">
      +1
      <Image src="/icons/chevron-down.svg" alt="" width={10} height={5} />
    </span>
    <input
      {...props}
      className={`h-full w-full bg-transparent text-sm leading-5 tracking-[0.14px] text-[#2E3033] placeholder:text-[#ACACAC] outline-none ${className}`}
    />
  </div>
)

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

export const SelectInput = ({ hasError, className = "", children, ...props }: SelectProps) => (
  <div className="relative">
    <select
      {...props}
      className={`${inputClass(hasError)} appearance-none pr-9 ${className}`}
    >
      {children}
    </select>
    <Image
      src="/icons/chevron-down.svg"
      alt=""
      width={10}
      height={5}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
    />
  </div>
)

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean
}

export const TextArea = ({ hasError, className = "", ...props }: TextAreaProps) => (
  <textarea
    {...props}
    className={`${inputClass(hasError)} h-[106px] resize-none py-2 ${className}`}
  />
)

export const FileUploadInput = ({
  fileName,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { fileName?: string }) => (
  <label
    className={`flex h-11 w-full items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white px-3 text-sm leading-5 tracking-[0.14px] text-[#2E3033] transition hover:bg-[#FAFAFA] ${
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    }`}
  >
    <Image src="/icons/upload-cloud.svg" alt="" width={20} height={15} />
    <span className="truncate">{fileName || "Click to upload"}</span>
    <input type="file" className="hidden" disabled={disabled} {...props} />
  </label>
)

/* ---------- primary action ---------- */

export const PrimaryButton = ({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`inline-flex h-11 items-center justify-center rounded-lg border-2 border-[#C9A227] bg-[#C9A227] px-4 text-base font-semibold leading-5 text-white transition hover:bg-white hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
)

/* ---------- "Verification in Progress" modal ---------- */

export const VerificationModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-[503px] flex-col items-center gap-[26px] rounded-2xl border border-[#C7C9CC] bg-white px-3 pb-11 pt-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[160px] w-[145px] items-center justify-center">
          <Image
            src="/illustrations/sand-clock.png"
            alt=""
            width={90}
            height={133}
            className="-rotate-[30deg] object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-[13px] px-6 text-center">
          <h3 className="text-xl font-semibold leading-6 text-[#17181A]">
            Verification in Progress
          </h3>
          <p className="text-base leading-6 tracking-[0.16px] text-[#2E3033]">
            You can explore listings right away. Bidding will unlock once your
            company is verified.
          </p>
        </div>
      </div>
    </div>
  )
}
