import React from 'react';
import Link from 'next/link';
import { Package, Eye, User, ArrowRight } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: Package,
      title: "Create Listing",
      description: "Add new scrap materials for sale",
      action: "Add new listing",
      href: "/sellerDashBoard/create-listing", // <-- page link
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      icon: Eye,
      title: "View Bids",
      description: "Check offers and respond quickly",
      action: "Check Bids",
      href: "/sellerDashBoard/Bids", // <-- page link
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      icon: User,
      title: "Edit Profile",
      description: "Update your account or contact info",
      action: "Update Profile",
      href: "/sellerDashBoard/edit-profile", // <-- page link
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="w-full pt-10">
      <div className="max-w-6xl mx-auto">
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto -mx-6 px-6">
          <div className="flex gap-4 pb-4">
            {features.map((feature, index) => (
              <div key={index} className="shrink-0 w-72">
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: any) {
  const Icon = feature.icon;
  
  return (
    <div className="p-2 transition-shadow hover:shadow-lg rounded-lg cursor-pointer">
      <div className="flex gap-2">
        <div className={`${feature.bgColor} w-12 h-12 rounded-lg mb-4 flex justify-center items-center`}>
          <Icon className={`${feature.iconColor} w-6 h-6`} />
        </div>

        <div>
         
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors">
              {feature.title}
            </h3>
         

          <p className="text-sm text-gray-600 mb-4">
            {feature.description}
          </p>

          <Link href={feature.href}  className="flex items-center text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors group">
            {feature.action}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
