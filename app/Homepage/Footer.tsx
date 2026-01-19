"use client"
import React from "react";
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#17181A] text-gray-300 py-12 px-4 md:px-20" id="contact">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 border-b border-gray-700 pb-6">
        {/* About Us & Contact - wider column */}
        <div className="md:col-span-2">
          <h2 className="font-bold text-white text-xs mb-1">About Us</h2>
          <p className="text-[10px] mb-4">
            The regulated B2B marketplace for buying and selling scrap metals safely, transparently, and in full compliance with industry standards.
          </p>

          <h2 className="font-bold text-white text-xs mb-1">Business Contact Information</h2>
          <p className="text-[10px]">
         3212-10448 University Drive<br />
            BC, Canada.<br />
            V3T 0S7
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-white text-xs mb-1">Company</h3>
          <ul className="space-y-1 text-[10px]">
            <li>About Us</li>
            <li>How It Works</li>
            <li>Marketplace</li>
            <li>Pricing</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-white text-xs mb-1">Resources</h3>
          <ul className="space-y-1 text-[10px]">
            <li>FAQs</li>
            <li>Blog / Insights</li>
            <li>Compliance Guide</li>
            <li>Case Studies</li>
            <li>Help Center</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-white text-xs mb-1">Legal</h3>
          <ul className="space-y-1 text-[10px]">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Verification Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-white text-xs mb-1">Help</h3>
          <ul className="space-y-1 text-[10px]">
            <li>FAQs</li>
            <li>Contact Support</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-[9px] text-gray-500">
        <p>© 2025 Metal Hive. All rights reserved.</p>
        <div className="flex items-center space-x-3 mt-1 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <div className="flex space-x-2 ml-2">
            <FaInstagram className="hover:text-white text-[10px]" />
            <FaTwitter className="hover:text-white text-[10px]" />
            <FaFacebookF className="hover:text-white text-[10px]" />
            <FaLinkedinIn className="hover:text-white text-[10px]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
