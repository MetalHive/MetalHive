import { Dispatch, SetStateAction } from "react";

interface Props {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  totalSteps: number;
}

export default function StepNavigation({
  currentStep,
  setCurrentStep,
  totalSteps,
}: Props) {
  return (
    <div className="flex items-center gap-4 py-4 ">
      <button
        disabled={currentStep === 1}
        onClick={() => setCurrentStep((s) => s - 1)}
        className="px-4 py-2 border border-[#E8E8E8] rounded-md "
      >
        Cancel
      </button>

      {currentStep < totalSteps ? (
        <button
          onClick={() => setCurrentStep((s) => s + 1)}
          className="px-6 py-2 bg-[#C9A227] text-white rounded-md"
        >
          Continue
        </button>
      ) : (
        <button className="px-6 py-2 bg-[#C9A227] text-white rounded-md">
          Publish
        </button>
      )}
    </div>
  );
}
