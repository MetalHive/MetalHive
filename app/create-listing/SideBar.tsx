const steps = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Upload Photo" },
    { id: 3, label: "Description" },
    { id: 4, label: "Preview & Publish" },
];

export default function Sidebar({ currentStep }: { currentStep: number }) {
    return (
        <aside className=" p-4 ">

            <h2 className="font-semibold text-xl mb-4">New Listing</h2>
            <ul className="space-y-2">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <>

                            <li
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-lg
                ${isActive ? "bg-[#F9F9FF]" : ""}
                ${currentStep < step.id ? "opacity-50" : ""}
              `}
                            >
                                {/* Step Number */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border font-medium
                  ${isActive
                                            ? "border-[#C9A227] text-[#C9A227]"
                                            : "border-gray-300 text-gray-600"
                                        }
                `}
                                >
                                    {step.id}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-700"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </li>
                        </>
                    );
                })}
            </ul>
        </aside>
    );
}
