"use client"
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { IoMdWallet } from "react-icons/io";
import { TiClipboard } from "react-icons/ti";

const Reason1 = () => {
  const cards = [
    {
      icon: <AiOutlineSafetyCertificate className="w-6 h-6" />,
      title: "Verified Buyers Only",
      desc: "Every buyer is verified with business documentation to ensure safety.",
    },
    {
      icon: <FaRegEye className="w-6 h-6 font"  />,
      title: "Transparent Transactions",
      desc: "Track every listing, bid, and sale in real time, full visibility from start to finish.",
    },
    {
      icon: <IoMdWallet className="w-6 h-6" />,
      title: "Secure Payments",
      desc: "Automatic commission handling and fast payouts after each completed trade.",
    },
    {
      icon: <TiClipboard className="w-6 h-6" />,
      title: "Compliance Management",
      desc: "Built-in KYC, document checks, and dispute resolution to protect both sides.",
    },
  ];

  return (
    <section className="text-[#17181A] py-16 px-6 md:px-16" id="impact">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Why Businesses Choose MetalHive
        </h2>
        <p className="text-sm md:text-base text-[#00000099]">
          A secure, compliant, and transparent marketplace built for the metal industry.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white  rounded-xl flex flex-col items-center text-center transition hover:shadow-md flex-1 min-w-[220px] max-w-[280px]"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-md mb-2">{card.title}</h3>
            <p className="text-sm text-[#00000099] leading-snug">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reason1;
