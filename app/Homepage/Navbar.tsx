"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Marketplace", href: "#impact" },
    { name: "How It Works", href: "#how" },
    { name: "Contact", href: "#contact" },
  ];
   const [hide, setHide] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // scrolling down
        setHide(true);
      } else {
        // scrolling up
        setHide(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <nav
     className={` top-0 left-0 w-full z-20 bg-transparent transition-transform duration-300 ${
        hide ? "-translate-y-full" : "translate-y-0"
      }`}
    // className="fixed top-0 left-0 w-full z-50 bg-transparent "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            <Image
              src="/logo.png"        
              alt="Metal Hive Logo"
              width={120}      
              height={120}
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#C9A227] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Button */}
          <div className="hidden md:block">
            <a href={"/auth"}>
            <button className=" hover:bg-[#C9A227] text-black hover:text-white bg-white font-semibold px-4 py-2 rounded-lg transition">
              Get Started
            </button>
            </a>
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden ">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-[#C9A227] transition-colors"
              >
                {link.name}
              </Link>
            ))}
                <Link href={"/auth"} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
