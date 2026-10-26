"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import listingsService from "@/app/lib/api/services/listingsService";
import type { MaterialType, ConditionType } from "@/app/stores/ListingFormStore";
import { FaArrowLeftLong } from "react-icons/fa6";
import Sidebar from "./SideBar";
import BasicDetails from "./steps/BasicDetails";
import UploadPhoto from "./steps/UploadPhoto";
import Description from "./steps/Description";
import PreviewPublish from "./steps/PreviewPublish";
import StepNavigation from "./StepNavigation";
import { useListingFormStore } from "@/app/stores/ListingFormStore";
import { useCreateListing, usePublishListing, useUpdateListing } from "@/app/hooks/useApi";
import { getErrorMessage, getFieldErrors } from "@/app/lib/api/client";
import { useToast } from "@/app/Components/Toast";

const TOTAL_STEPS = 4;

export default function CreateListing() {
  const toast = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [publishError, setPublishError] = useState<string | null>(null);

  const {
    validateStep, getFormData, resetForm, draftId, setDraftId,
    updateBasicDetails, updateImages, updateDescription, updateAdditionalNotes,
  } = useListingFormStore();
  const createListing = useCreateListing();

  // `?draft=<id>` reopens a saved draft so the seller can finish it (e.g. add
  // the photos they skipped) and publish.
  const draftParam = useSearchParams().get("draft");
  const [loadingDraft, setLoadingDraft] = useState(Boolean(draftParam));
  useEffect(() => {
    if (!draftParam) return;
    let cancelled = false;
    (async () => {
      try {
        const l = await listingsService.getListingById(draftParam);
        if (cancelled) return;
        if (l.status !== "draft") {
          toast.error("Only draft listings can be edited here.");
          router.replace(`/sellerDashBoard/${draftParam}`);
          return;
        }
        resetForm();
        updateBasicDetails({
          materialName: l.title,
          materialType: l.materialType as MaterialType,
          condition: l.condition as ConditionType,
          quantity: l.quantityValue ? String(parseFloat(l.quantityValue)) : l.quantity.replace(/[^0-9.]/g, ""),
          quantityUnit: l.quantityUnit || "kg",
          basePrice: String(l.price),
          priceUnit: (l.priceUnit as typeof l.quantityUnit) || "kg",
          location: l.location,
        });
        updateImages(l.images || []);
        updateDescription(l.description || "");
        updateAdditionalNotes(l.additionalNotes || "");
        setDraftId(l.id);
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Could not load the draft."));
      } finally {
        if (!cancelled) setLoadingDraft(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Store setters are stable; this should run once per draft id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftParam]);
  const updateListing = useUpdateListing();
  const publishListing = usePublishListing();
  const [savingDraft, setSavingDraft] = useState(false);
  const mutating = createListing.isPending || updateListing.isPending || publishListing.isPending;
  const isPublishing = mutating && !savingDraft;

  // Creates the listing the first time, updates the same draft afterwards, so
  // saving a draft and then publishing never produces two listings.
  const persistListing = async (formData: ReturnType<typeof getFormData>) => {
    if (draftId) {
      await updateListing.mutateAsync({ id: draftId, data: formData });
      return draftId;
    }
    const result = await createListing.mutateAsync(formData);
    setDraftId(result.id);
    return result.id;
  };

  // Available from step 2 on: only the basic details are required for a draft.
  const handleSaveDraft = async () => {
    const errors = validateStep(1);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      setCurrentStep(1);
      toast.error("Complete the basic details before saving a draft.");
      return;
    }
    setSavingDraft(true);
    try {
      await persistListing(getFormData());
      toast.success("Saved as a draft. Publish it any time from the Draft tab in your listings.");
      resetForm();
      router.push("/sellerDashBoard/Listing");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not save the draft. Please try again."));
    } finally {
      setSavingDraft(false);
    }
  };

  // Each step must be complete before moving on. Errors are handed to the
  // step component so they show up next to the offending field.
  const goNext = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      toast.error(Object.values(errors)[0]);
      return;
    }
    setStepErrors({});
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => {
    setStepErrors({});
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const goToStep = (step: number) => {
    setStepErrors({});
    setCurrentStep(step);
  };

  const cancel = () => {
    resetForm();
    router.push("/sellerDashBoard/Listing");
  };

  // One publish handler, shared by the header button and the preview step.
  const handlePublish = async () => {
    // Re-validate everything so a listing can't be published with a step
    // that was skipped via the header navigation.
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const errors = validateStep(step);
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        setCurrentStep(step);
        toast.error(Object.values(errors)[0]);
        return;
      }
    }

    setPublishError(null);
    const formData = getFormData();

    let createdId: string;
    try {
      createdId = await persistListing(formData);
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      const message = getErrorMessage(error, "Failed to create listing. Please try again.");
      const detail = Object.entries(fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(" ");
      const full = detail && !message.includes(detail) ? `${message} ${detail}` : message;
      setPublishError(full);
      toast.error(full);
      return;
    }

    try {
      await publishListing.mutateAsync(createdId);
      toast.success("Listing published successfully!");
      resetForm();
      router.push("/sellerDashBoard/Listing");
    } catch (error: unknown) {
      const message = getErrorMessage(error, "The listing was saved as a draft but could not be published.");
      toast.toast(`Listing saved as a draft. ${message}`, "info");
      resetForm();
      router.push("/sellerDashBoard/Listing");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails errors={stepErrors} />;
      case 2:
        return <UploadPhoto onBack={goBack} error={stepErrors.images} />;
      case 3:
        return <Description onBack={goBack} />;
      case 4:
        return (
          <PreviewPublish
            onBack={goBack}
            onEdit={() => goToStep(1)}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            error={publishError}
          />
        );
      default:
        return null;
    }
  };

  const showSidebar = currentStep !== 4; // hide sidebar on step 4

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="shadow">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logoBlack.png"
              width={120}
              height={120}
              alt="MetalHive black logo"
            />
          </div>

          {/* Navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onCancel={cancel}
            onContinue={goNext}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={savingDraft}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          <div
            className={`bg-white rounded-lg min-h-[600px] grid ${showSidebar ? "grid-cols-[260px_1fr]" : "grid-cols-1"
              }`}
          >
            {showSidebar && <Sidebar currentStep={currentStep} />}

            <div className="p-6 overflow-y-auto">
              <Link href={'/sellerDashBoard'} >
                <button className="flex items-center gap-2 text-gray-500 text-sm border-2 border-[#D8D8D8] w-20 h-10 rounded-full px-3 mb-6">

                  <FaArrowLeftLong size={20} /> <span>Back</span>
                </button>
              </Link>

              {loadingDraft ? (
                <div className="flex items-center justify-center py-20">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9A227]"></div>
                </div>
              ) : (
                renderStep()
              )}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
