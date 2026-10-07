import type { ComponentType } from 'react'
import { Home, Grid, Wallet } from 'lucide-react'
import { BsShop } from "react-icons/bs";
import { MdAnalytics } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPricetagOutline } from "react-icons/io5";

export type SidebarIcon = ComponentType<{ size?: number; className?: string }>

export interface SidebarLink {
  label: string
  href: string
  icon: SidebarIcon
  /** 'walletBalance' renders the seller's live available balance. */
  badge?: 'walletBalance'
}

export const sellerSidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    href: '/sellerDashBoard',
    icon: Home,
  },

  {
    label: 'Listings',
    href: '/sellerDashBoard/Listing',
    icon: Grid,
  },

  {
    label: 'Wallet',
    href: '/sellerDashBoard/wallet',
    icon: Wallet,
    badge: 'walletBalance',
  }, {
    label: 'History',
    href: '/sellerDashBoard/history',
    icon: MdAnalytics,
  },
  {
    label: 'Settings',
    href: '/sellerDashBoard/Settings',
    icon: IoSettingsOutline,
  },
]

export const buyerSidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    href: '/buyersDashboard',
    icon: Home,
  },
  {
    label: 'Marketplace',
    href: '/buyersDashboard/Marketplace',
    icon: BsShop,
  },
  {
    label: 'Bids',
    href: '/buyersDashboard/bids',
    icon: IoPricetagOutline,
  },
  {
    label: 'History',
    href: '/buyersDashboard/history',
    icon: MdAnalytics,
  },
  {
    label: 'Settings',
    href: '/buyersDashboard/settings',
    icon: IoSettingsOutline,
  },
]
