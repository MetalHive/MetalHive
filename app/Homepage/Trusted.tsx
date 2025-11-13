import Image from "next/image";

const Trusted = () => {
  const cards = [
    {
      img: "/t1.png",
      title: "List Your Scrap",
      desc: "Upload your materials, set an optional base price, and publish your listing for verified buyers to see.",
    },
    {
      img: "/t2.png",
      title: "Verified Buyers Place Bids",
      desc: "Only licensed, verified companies can bid, ensuring compliance and fair competition.",
    },
    {
      img: "/t3.png",
      title: "Accept Offers & Get Paid",
      desc: "Choose the best offer, confirm the sale, and receive payment securely",
    },
  ];

  return (
    <section className="bg-[#F9F9F9] text-[#17181A] py-12 px-6 md:px-16">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Simple, Compliant, and Built for Real Trading
        </h2>
        <p className="text-xs md:text-sm text-[#00000099]">
          From listing scrap to completing payments, MetalHive makes every step clear, compliant, and connected.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden transition hover:shadow-md p-2"
          >
            <Image
              src={card.img}
              alt={card.title}
              width={320}
              height={200}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <div className="px-1 text-left">
              <h3 className="text-base md:text-lg font-semibold mb-1">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-[#00000099] leading-snug">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trusted;
