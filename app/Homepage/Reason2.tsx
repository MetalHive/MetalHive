"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
const Reason2: React.FC = () => {
  const cards = [
    {
      imgSrc: "/bid1.png",
      title: "Aluminum Sheets (1.2 tons)",
      price: "$59.00",
      description: "Clean aluminum cuttings from manufacturing processes. Ideal for recycling or remolding.",
      company: "Metal Pro Industries",
    },
    {
      imgSrc: "/bid2.png",
      title: "Copper Wires (500kg)",
      price: "$120.00",
      description: "High-quality copper wire scrap, perfect for recycling or resale.",
      company: "CopperTech Ltd",
    },
    {
      imgSrc: "/bid3.png",
      title: "Steel Rods (2 tons)",
      price: "$200.00",
      description: "Solid steel rods from construction leftovers. Great for metalworks.",
      company: "SteelWorks Inc",
    },
    {
      imgSrc: "/bid4.png",
      title: "Plastic Bottles (3 tons)",
      price: "$80.00",
      description: "Collected PET bottles ready for recycling into new products.",
      company: "GreenCycle Co.",
    },
    {
      imgSrc: "/bid5.png",
      title: "Cardboard Sheets (1 ton)",
      price: "$50.00",
      description: "Used cardboard sheets, suitable for packaging and crafts.",
      company: "PackIt Industries",
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null); // ✅ typed
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cardWidth = container.children[0].clientWidth + 24; // include gap
    let nextIndex = currentIndex + 1;

    if (nextIndex >= cards.length) {
      container.scrollTo({ left: 0, behavior: "smooth" });
      nextIndex = 0;
    } else {
      container.scrollTo({ left: cardWidth * nextIndex, behavior: "smooth" });
    }

    setCurrentIndex(nextIndex);
  };

  return (
    <div className="py-12 px-6 md:px-12 lg:px-20">
      {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
  <div className="flex-1">
    <p className="font-extralight text-sm md:text-base text-[#17181A] mb-2">
      The MetalHive Impact
    </p>
    <h2 className="text-xl md:text-2xl font-semibold mb-2">
      Trusted by a Growing Network of Verified Traders
    </h2>
    <p className="font-extralight text-sm md:text-base text-[#17181A]">
      Every connection, bid, and transaction on MetalHive is proof that the future of scrap metal trading is digital, compliant, and efficient.
    </p>
  </div>

      <Link href={"/auth"} className="bg-[#C9A227] text-white hover:bg-white hover:text-[#C9A227] font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition w-full md:w-auto">
    Get Started
  </Link>
</div>


      {/* Horizontal Scroll Cards Section */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="shrink-0 w-64 bg-white rounded-xl shadow hover:shadow-md overflow-hidden transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={card.imgSrc}
                  alt={card.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-4 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[14px]">{card.title}</h3>
                  <span className="font-semibold text-sm">{card.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{card.description}</p>
                <p className="text-xs font-medium mb-3">{card.company}</p>
                <button className="text-[#C9A227] text-sm font-semibold flex items-center gap-1">
                  Send Bid &gt;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chevron Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:shadow-md transition"
        >
          <FaChevronRight className="text-[#C9A227] w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Reason2;
