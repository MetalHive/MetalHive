import ProductCard from "./marketPlaceCard";
import Link from "next/link";
const MarketPlace = () => {
    const sampleProducts = [
        {
            id: '1',
            title: "Copper Scrap",
            price: "$520 / tonne",
            location: "Liverpool",
            timeAgo: "2 hours ago",
            description: "Bulk supply available, uniform quality",
            images: ["/bid1.png", "/bid2.png", "/bid3.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '2',
            title: "Aluminium Ingots",
            price: "$1,200 / tonne",
            location: "Manchester",
            timeAgo: "5 hours ago",
            description: "High-grade aluminium suitable for industrial use",
            images: ["/bid2.png", "/bid3.png", "/bid4.png"],
        },
        {
            id: '3',
            title: "Steel Rebars",
            price: "$780 / tonne",
            location: "Birmingham",
            timeAgo: "1 day ago",
            description: "Construction-grade steel, ready for pickup",
            images: ["/bid3.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '4',
            title: "Brass Scrap",
            price: "$640 / tonne",
            location: "Leeds",
            timeAgo: "3 hours ago",
            description: "Clean brass scrap with consistent composition",
            images: ["/bid1.png", "/bid3.png", "/bid5.png"],
        },
        {
            id: '5',
            title: "Iron Ore",
            price: "$410 / tonne",
            location: "Sheffield",
            timeAgo: "6 hours ago",
            description: "Raw iron ore available in large quantities",
            images: ["/bid2.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '6',
            title: "Zinc Sheets",
            price: "$890 / tonne",
            location: "Nottingham",
            timeAgo: "12 hours ago",
            description: "Weather-resistant zinc sheets for roofing",
            images: ["/bid1.png", "/bid2.png", "/bid3.png"],
        },
        {
            id: '7',
            title: "Lead Blocks",
            price: "$1,050 / tonne",
            location: "Bristol",
            timeAgo: "8 hours ago",
            description: "Dense lead blocks for industrial applications",
            images: ["/bid3.png", "/bid4.png"],
        },
        {
            id: '8',
            title: "Nickel Alloy",
            price: "$2,300 / tonne",
            location: "Coventry",
            timeAgo: "1 day ago",
            description: "Premium nickel alloy with corrosion resistance",
            images: ["/bid2.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '9',
            title: "Tin Plates",
            price: "$980 / tonne",
            location: "Derby",
            timeAgo: "4 hours ago",
            description: "Tin-coated plates suitable for packaging",
            images: ["/bid1.png", "/bid2.png", "/bid5.png"],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Marketplace Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Browse available materials from verified sellers
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProducts.map((product) => (
                    <Link
                        key={product.id}
                        href={`/buyersDashboard/marketplace/${product.id}`}
                        className="block"
                    >
                        <ProductCard {...product} />
                    </Link>
                ))}
            </div>

        </div>


    )
}

export default MarketPlace