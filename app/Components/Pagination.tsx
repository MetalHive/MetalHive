'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationInfo {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
    totalPages?: number;
}

interface PaginationProps {
    page: number;
    pagination?: PaginationInfo | null;
    onPageChange: (page: number) => void;
    className?: string;
}

/** Total page count, tolerating both `totalPages` and the older `pages`. */
export const getTotalPages = (pagination?: PaginationInfo | null): number => {
    if (!pagination) return 1;
    const value = pagination.totalPages ?? pagination.pages;
    return typeof value === 'number' && value > 0 ? value : 1;
};

const Pagination: React.FC<PaginationProps> = ({ page, pagination, onPageChange, className = '' }) => {
    const totalPages = getTotalPages(pagination);
    if (totalPages <= 1) return null;

    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className={`flex items-center justify-between gap-4 pt-6 ${className}`}>
            <p className="text-sm text-[#737780]">
                Page <span className="font-medium text-[#17181a]">{page}</span> of{' '}
                <span className="font-medium text-[#17181a]">{totalPages}</span>
                {typeof pagination?.total === 'number' && (
                    <span className="ml-2">({pagination.total} total)</span>
                )}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => canPrev && onPageChange(page - 1)}
                    disabled={!canPrev}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                </button>
                <button
                    type="button"
                    onClick={() => canNext && onPageChange(page + 1)}
                    disabled={!canNext}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
