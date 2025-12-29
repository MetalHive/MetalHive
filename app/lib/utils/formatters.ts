import { format, formatDistance, parseISO } from 'date-fns';

// Format date to readable string
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
    try {
        return format(parseISO(dateString), formatStr);
    } catch {
        return dateString;
    }
};

// Format date to relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
    try {
        return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
    } catch {
        return dateString;
    }
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

// Format number with commas
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
};
