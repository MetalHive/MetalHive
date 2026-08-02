"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import bidsService from "@/app/lib/api/services/bidsService";
import { useBidDetail } from "@/app/hooks/useApi";
import { AcceptBidModal, CounterOfferModal, DeclineBidModal } from "@/app/Components/BidModals";
import { SuccessModal } from "@/app/Components/Modals";

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default function BidDetails() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bidId = params.id as string;

  const { data: bid, isLoading, error } = useBidDetail(bidId);

  const [currentImage, setCurrentImage] = useState(0);
  const [showAccept, setShowAccept] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["bid", bidId] });
    queryClient.invalidateQueries({ queryKey: ["bids"] });
  };

  const handleAccept = async (price: number, notes?: string) => {
    setIsSubmitting(true);
    try {
      await bidsService.acceptBid(bidId, { acceptedPrice: price, notes });
      setShowAccept(false);
      refresh();
      setSuccess({
        title: "Offer accepted",
        message: "The buyer has been notified and next steps can begin.",
      });
    } catch (err) {
      console.error("Failed to accept bid:", err);
      alert("Failed to accept bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCounter = async (price: number, message?: string) => {
    setIsSubmitting(true);
    try {
      await bidsService.counterOffer(bidId, {
        counterPrice: price,
        counterPriceUnit: bid?.offerPriceUnit ?? 'kg',
        message,
      });
      setShowCounter(false);
      refresh();
      setSuccess({ title: "Counter offer sent", message: "The buyer has been notified." });
    } catch (err) {
      console.error("Failed to send counter offer:", err);
      alert("Failed to send counter offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async (reason: string) => {
    setIsSubmitting(true);
    try {
      await bidsService.rejectBid(bidId, reason);
      setShowDecline(false);
      refresh();
      setSuccess({ title: "Offer declined", message: "The buyer has been notified." });
    } catch (err) {
      console.error("Failed to decline bid:", err);
      alert("Failed to decline bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]" />
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">This bid could not be loaded.</p>
        <Link href="/sellerDashBoard/Bids" className="text-[#C9A227] hover:underline">
          Back to bids
        </Link>
      </div>
    );
  }

  const images: string[] = bid.listing?.images?.length ? bid.listing.images : ["/bid1.png"];
  const isPending = bid.status === "pending";

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/sellerDashBoard/Bids">
            <ArrowLeft className="w-5 h-5 cursor-pointer" />
          </Link>

          <button
            onClick={() => router.push(`/sellerDashBoard/${bid.listing?.id}`)}
            className="text-sm text-gray-600 hover:underline"
          >
            Go to listing ↗
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">{bid.listing?.name}</h2>
            <img
              src={images[currentImage]}
              alt={bid.listing?.name || "Listing"}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />

            {images.length > 1 && (
              <div className="flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-2 h-2 rounded-full ${i === currentImage ? "bg-[#C9A227]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}

            {/* Bid info */}
            <div>
              <p className="text-lg font-semibold">
                Bid from {bid.buyer?.companyName || bid.buyer?.name || "Buyer"}
              </p>
              {bid.buyer?.region && (
                <p className="text-sm text-gray-500 mt-1">Region: {bid.buyer.region}</p>
              )}

              {bid.message && (
                <>
                  <p className="text-md text-gray-600 mt-5 mb-3">Message</p>
                  <p>{bid.message}</p>
                </>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm pt-2">
              <div>
                <p className="text-gray-400 mb-3">Offer</p>
                <p className="font-medium">
                  ${Number(bid.offerPrice).toFixed(2)} / {bid.offerPriceUnit}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-3">Total</p>
                <p className="font-medium">
                  {bid.totalAmount
                    ? `$${Number(bid.totalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-3">Location</p>
                <p className="font-medium">{bid.location || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-3">Weight</p>
                {/* bid.weight already carries its unit ("30kg") */}
                <p className="font-medium">{bid.weight || "—"}</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="p-4 space-y-4 mt-12 h-fit">
            {bid.timeline?.length > 0 ? (
              bid.timeline.map((item: any, index: number) => (
                <div key={index}>
                  <p className="text-xl text-gray-500">{item.label}</p>
                  {item.timestamp && (
                    <p className="text-md font-semibold">{formatDateTime(item.timestamp)}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No activity yet.</p>
            )}

            {/* Only a pending offer can still be acted on; the buttons used to
                show regardless of status and did nothing when clicked. */}
            {isPending ? (
              <>
                <button
                  onClick={() => setShowAccept(true)}
                  className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white py-2 rounded-lg font-medium"
                >
                  Accept Bid
                </button>

                <button
                  onClick={() => setShowCounter(true)}
                  className="w-full border border-gray-300 py-2 rounded-lg text-sm"
                >
                  Counter Offer
                </button>

                <button
                  onClick={() => setShowDecline(true)}
                  className="w-full border border-gray-300 py-2 rounded-lg text-sm text-red-600"
                >
                  Decline
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500 capitalize">
                This offer is {bid.status}.
              </p>
            )}
          </div>
        </div>
      </div>

      <AcceptBidModal
        isOpen={showAccept}
        onClose={() => setShowAccept(false)}
        onConfirm={handleAccept}
        bid={{
          buyer: { companyName: bid.buyer?.companyName || bid.buyer?.name || "Buyer" },
          listing: { name: bid.listing?.name || "Listing" },
          offerPrice: String(bid.offerPrice),
        }}
        isLoading={isSubmitting}
      />

      <CounterOfferModal
        isOpen={showCounter}
        onClose={() => setShowCounter(false)}
        onSubmit={handleCounter}
        bid={{ offerPrice: String(bid.offerPrice), offerPriceUnit: bid.offerPriceUnit }}
        isLoading={isSubmitting}
      />

      <DeclineBidModal
        isOpen={showDecline}
        onClose={() => setShowDecline(false)}
        onConfirm={handleDecline}
        isLoading={isSubmitting}
      />

      {success && (
        <SuccessModal
          isOpen
          onClose={() => setSuccess(null)}
          title={success.title}
          message={success.message}
        />
      )}
    </div>
  );
}
