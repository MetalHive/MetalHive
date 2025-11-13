import { IoLogoTwitter } from "react-icons/io5";
const Reason3 = () => {
    const testimonials = [
  {
    title: " Incredibly useful product",
    text: "We used to struggle finding compliant buyers for our leftover metals. With Metal Hive, verified companies now reach out directly — and we close sales faster than ever.",
    name: "EcoScrap Ltd",
    location: "United Kingdom",
    initials: "ES",
    icon: "twitter", // You can add actual icon logic if needed
  },
  {
     title: " Incredibly useful product",
    text: "We used to struggle finding compliant buyers for our leftover metals. With Metal Hive, verified companies now reach out directly — and we close sales faster than ever.",
    name: "GreenMetal Co.",
    location: "Germany",
    initials: "GM",
    icon: "twitter",
  },
  {
     title: " Incredibly useful product",
    text: "We used to struggle finding compliant buyers for our leftover metals. With Metal Hive, verified companies now reach out directly — and we close sales faster than ever.",
    name: "RecyclePro",
    location: "USA",
    initials: "RP",
    icon: "twitter",
  },
];
  return (
  <section className="text-[#17181A] py-16 px-6 md:px-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Why Businesses Choose MetalHive
        </h2>
        <p className="text-sm md:text-base text-[#00000099]">
          A secure, compliant, and transparent marketplace built for the metal industry.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 px-6 md:px-12 lg:px-20">
      {testimonials.map((testimonial, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-6 flex-1">
            <p className="text-sm mb-4 font-semibold">{testimonial.title}</p>
          <p className="text-xs mb-4  text-[#6A6C6F]">{testimonial.text}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-sm font-semibold">
                {testimonial.initials}
              </div>
              <div className="text-xs">
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-gray-400">{testimonial.location}</p>
              </div>
            </div>
            <div className="text-blue-400">
              {/* Replace with actual icon component if needed */}
             <IoLogoTwitter size={32} />
            </div>
          </div>
        </div>
      ))}
    </div>
      </section>
  )
}

export default Reason3