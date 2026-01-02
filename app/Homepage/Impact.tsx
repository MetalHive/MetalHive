"use client"

import Image from "next/image";
import Link from "next/link";
const Impact = () => {
  return (
    <section className="bg-[#17181A] text-white py-12 px-6 md:px-12 lg:px-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-xl">
          <p className="font-extralight text-sm md:text-base text-[#FFFFFF80] mb-2">
            The MetalHive Impact
          </p>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Trusted by a Growing Network of Verified Traders
          </h2>
          <p className="font-extralight text-sm md:text-base text-[#FFFFFF80]">
            Every connection, bid, and transaction on MetalHive is proof that the future
            of scrap metal trading is digital, compliant, and efficient.
          </p>
        </div>

           <Link href={"/auth"} className="bg-white hover:bg-[#C9A227] hover:text-white font-semibold text-black px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition w-full md:w-auto">
          Get Started
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {[
          {
            img: "/hero-bg.jpg",
            value: "1,200+",
            desc: "Licensed companies actively sourcing scrap with MetalHive.",
          },
          {
            img: "/hero-bg.jpg",
            value: "800+",
            desc: "Registered businesses listing scrap materials monthly.",
          },
          {
            img: "/hero-bg.jpg",
            value: "$300K+",
            desc: "In verified scrap trades processed securely.",
          },
          {
            img: "/hero-bg.jpg",
            value: "2.5 Days",
            desc: "Average time from listing to successful sale.",
          },
        ].map((stat, i) => (
          <div key={i} className="flex items-start gap-3 w-60">
            <Image
              src={stat.img}
              alt="Metal Hive Icon"
              width={32}
              height={32}
              className="w-8 h-8  object-cover"
            />
            <div>
              <h3 className="text-lg md:text-xl font-medium">{stat.value}</h3>
              <p className="text-[#FFFFFF80] text-sm md:text-base leading-snug ">
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Impact;
