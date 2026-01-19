"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "./SideBar";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import BasicDetails from "./steps/BasicDetails";
import UploadPhoto from "./steps/UploadPhoto";
import Description from "./steps/Description";
import PreviewPublish from "./steps/PreviewPublish";
import StepNavigation from "./StepNavigation";

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    const goBack = () => setCurrentStep(prev => prev - 1);

    switch (currentStep) {
      case 1:
        return <BasicDetails />;
      case 2:
        return <UploadPhoto onBack={goBack} />;
      case 3:
        return <Description onBack={goBack} />;
      case 4:
        return <PreviewPublish onBack={goBack} />;
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
            setCurrentStep={setCurrentStep}
            totalSteps={4}
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

              {renderStep()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
