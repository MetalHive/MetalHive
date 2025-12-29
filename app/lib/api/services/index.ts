// Export all services from a central location
export { default as authService } from './authService';
export { default as dashboardService } from './dashboardService';
export { default as listingsService } from './listingsService';
export { default as bidsService } from './bidsService';
export { default as walletService } from './walletService';
export { default as historyService } from './historyService';

// Re-export types
export type { LoginCredentials, BuyerRegistrationData, SellerRegistrationData } from './authService';
export type { DashboardStats } from './dashboardService';
export type { Listing, ListingDetail, ListingsResponse, CreateListingData } from './listingsService';
export type { Bid, BidDetail, BidsResponse } from './bidsService';
export type { WalletSummary, MonthlyEarnings, Transaction, TransactionsResponse } from './walletService';
export type { Sale, SalesHistoryResponse } from './historyService';
