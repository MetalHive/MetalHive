interface Props {
  currentStep: number;
  totalSteps: number;
  /** Leaves the wizard entirely. */
  onCancel: () => void;
  /** Validates the current step and advances. */
  onContinue: () => void;
  /** Same publish handler the preview step uses. */
  onPublish: () => void;
  isPublishing?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onCancel,
  onContinue,
  onPublish,
  isPublishing = false,
}: Props) {
  return (
    <div className="flex items-center gap-4 py-4 ">
      <button
        type="button"
        onClick={onCancel}
        disabled={isPublishing}
        className="px-4 py-2 border border-[#E8E8E8] rounded-md disabled:opacity-50"
      >
        Cancel
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2 bg-[#C9A227] text-white rounded-md"
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="px-6 py-2 bg-[#C9A227] text-white rounded-md disabled:opacity-50"
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      )}
    </div>
  );
}
