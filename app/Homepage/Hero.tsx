"use client";

import Image from "next/image";
import Navbar from "./Navbar";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-screen bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Metal Hive Background"
          fill
          className="object-cover brightness-75"
        />
      </div>

      {/* Navbar */}
      <div className="z-20 relative">
        <Navbar />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 max-w-3xl">
        <div className="flex items-center gap-4 mb-8 md:left-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit px-4 py-2">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                src={`/e${i}.jpg`}
                alt={`User ${i}`}
                width={36}
                height={36}
                className="rounded-full h-12 w-12 border-2 border-white object-cover"
              />
            ))}
          </div>
          <p className="text-white font-medium whitespace-nowrap">
            Only 100 spots available
          </p>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          The Trusted Marketplace for Scrap Metal Trading
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Buy and sell scrap metals in a compliant, transparent, and regulated
          environment. MetalHive connects verified companies and sellers,
          ensuring fair trade, trust, and efficiency.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href={"/auth"}
            className="bg-white hover:bg-[#C9A227] hover:text-white font-semibold text-black px-6 py-3 rounded-lg transition"
          >
            Get Started
          </Link>
          <Link
            href={"/auth"} className="border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg font-semibold transition">
            View Listing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
