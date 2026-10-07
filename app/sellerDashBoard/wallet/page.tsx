"use client"

import React, { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import SideBar from "../../Components/SideBar"
import EarningsChart from "../../Components/EarningsChart"
import { Modal } from "../../Components/Modals"
import { useWalletSummary, useMonthlyEarnings, useRequestWithdrawal } from "../../hooks/useApi"
import { usePayoutDetails } from "../../hooks/useSettings"
import { sellerSidebarLinks } from "../../lib/sidebarConfig"
import { formatDate } from "../../lib/utils/formatters"
import { getErrorMessage, getFieldErrors } from "@/app/lib/api/client"
import { useToast } from "@/app/Components/Toast"

interface Stat {
  title: string
  value: string
  subText: string
}

const money = (value: number | undefined | null) =>
  `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  bankAccountId: string | null
  bankLabel: string | null
}

const WithdrawFundsModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, availableBalance, bankAccountId, bankLabel }) => {
  const toast = useToast()
  const requestWithdrawal = useRequestWithdrawal()
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const parsedAmount = parseFloat(amount)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      next.amount = "Enter an amount greater than zero."
    } else if (parsedAmount > availableBalance) {
      next.amount = `You can withdraw at most ${money(availableBalance)}.`
    }
    if (!bankAccountId) {
      next.form = "Add your payout details before requesting a withdrawal."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate() || !bankAccountId) return
    requestWithdrawal.mutate(
      { amount: Math.round(parsedAmount * 100) / 100, bankAccountId, notes: notes.trim() || undefined },
      {
        onSuccess: (result) => {
          toast.success(
            `Withdrawal of ${money(result.amount)} requested. Estimated completion: ${formatDate(result.estimatedCompletionDate)}.`
          )
          setAmount("")
          setNotes("")
          setErrors({})
          onClose()
        },
        onError: (error) => {
          // Field-level errors (e.g. the API's minimum) show inline; anything
          // else goes under the form.
          const fieldErrors = getFieldErrors(error)
          if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors)
          } else {
            setErrors({ form: getErrorMessage(error, "Failed to request withdrawal. Please try again.") })
          }
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#17181a]">Withdraw Funds</h2>
          <button onClick={onClose} className="text-[#737780] hover:text-[#17181a]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#737780] mb-6">
          Available balance: <span className="font-semibold text-[#17181a]">{money(availableBalance)}</span>
        </p>

        {bankAccountId ? (
          <p className="text-xs text-[#737780] mb-4">
            Paying out to <span className="font-medium text-[#17181a]">{bankLabel}</span>.{" "}
            <Link href="/sellerDashBoard/Settings/payout" className="text-[#C9A227] hover:underline">
              Change
            </Link>
          </p>
        ) : (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            No payout account on file.{" "}
            <Link href="/sellerDashBoard/Settings/payout" className="font-medium underline">
              Add payout details
            </Link>{" "}
            to withdraw.
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#737780] mb-2">Amount (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setErrors((prev) => ({ ...prev, amount: "" }))
            }}
            aria-invalid={errors.amount ? true : undefined}
            className={`w-full px-4 py-3 border rounded-lg text-lg font-semibold text-[#17181a] focus:outline-none ${
              errors.amount ? "border-red-400 focus:border-red-500" : "border-[#ececec] focus:border-[#C9A227]"
            }`}
            placeholder="0.00"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
          <button
            type="button"
            onClick={() => setAmount(availableBalance.toFixed(2))}
            className="mt-2 text-xs font-medium text-[#C9A227] hover:underline"
          >
            Withdraw full balance
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#737780] mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227] resize-none"
            placeholder="Anything our payouts team should know"
          />
        </div>

        {errors.form && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#ececec] text-[#17181a] font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={requestWithdrawal.isPending || !bankAccountId}
            className="flex-1 px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors disabled:opacity-50"
          >
            {requestWithdrawal.isPending ? "Requesting..." : "Request Withdrawal"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

const WalletPage = () => {
  // Fetch wallet data and earnings from API
  const { data: wallet, isLoading: walletLoading } = useWalletSummary()
  const { data: earningsData, isLoading: earningsLoading } = useMonthlyEarnings()
  const { data: payoutDetails } = usePayoutDetails()
  const [showWithdraw, setShowWithdraw] = useState(false)

  const availableBalance = Number(wallet?.availableBalance || 0)

  // Map API data to stats
  const stats: Stat[] = [
    {
      title: "Available Balance",
      value: money(wallet?.availableBalance),
      subText: "Withdrawable balance",
    },
    {
      title: "Pending Payouts",
      value: money(wallet?.pendingPayouts),
      subText: "Processing from trades",
    },
    {
      title: "Total Earned",
      value: money(wallet?.totalEarned),
      subText: "All-time earnings",
    },
    {
      title: "Last Payout",
      value: wallet?.lastPayout ? money(wallet.lastPayout.amount) : '$0.00',
      subText: wallet?.lastPayout?.date ? formatDate(wallet.lastPayout.date) : 'No payouts yet',
    },
  ]

  const earnings = earningsData?.earnings || []

  const bankLabel = payoutDetails
    ? `${payoutDetails.bankName || payoutDetails.paymentMethod} ****${payoutDetails.accountNumberLast4}`
    : null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar links={sellerSidebarLinks} />

      <div className="flex-1 p-6 mt-16 lg:mt-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#17181A]">Payouts</h1>
          <p className="text-[#737780]">
            Track your earnings, withdrawal history, and payout status in one place.
          </p>
        </div>

        {/* Loading State */}
        {walletLoading && (
          <div className="mt-6 flex justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]"></div>
          </div>
        )}

        {/* Stats Grid */}
        {!walletLoading && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-[#EFEFEF] p-6 shadow-sm"
                >
                  <p className="text-sm text-[#737780]">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#17181A]">
                    {stat.value}
                  </h2>
                  <p className="mt-1 text-xs text-[#737780]">{stat.subText}</p>
                </div>
              ))}
            </div>

            {/* Earnings Chart */}
            <div className="mt-6">
              <EarningsChart earnings={earnings} isLoading={earningsLoading} />
            </div>

            {/* Withdraw Button */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => setShowWithdraw(true)}
                disabled={availableBalance <= 0}
                title={availableBalance <= 0 ? "No funds available to withdraw" : undefined}
                className="bg-[#C9A227] hover:bg-[#B08F1F] text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw Funds
              </button>
              {availableBalance <= 0 && (
                <p className="text-sm text-[#737780]">Nothing to withdraw yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {showWithdraw && (
        <WithdrawFundsModal
          isOpen={showWithdraw}
          onClose={() => setShowWithdraw(false)}
          availableBalance={availableBalance}
          bankAccountId={payoutDetails?.id ? String(payoutDetails.id) : null}
          bankLabel={bankLabel}
        />
      )}
    </div>
  )
}

export default WalletPage
