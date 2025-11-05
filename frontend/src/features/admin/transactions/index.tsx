import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import type { Transaction } from "@/types/transaction";
import { TransactionTable } from "../components/transaction-table";

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    totalTransactions: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function PendingTransactions() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<TransactionsResponse>({
      queryKey: ["transactions", page],
      queryFn: async () => {
        const res = await authApiClient.get(`/admin/transaction?page=${page}`);
        return res.data as TransactionsResponse;
      },
      placeholderData: (prev) => prev,
    });

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination;

  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const visiblePages = 5;

    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let end = start + visiblePages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and monitor all platform transactions
          </p>
        </div>
      </div>

      <Card>
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Failed to load transactions.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <TransactionTable transactions={transactions} />

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-border gap-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination?.currentPage} of {pagination?.totalPages} •{" "}
                {pagination?.totalTransactions} transactions
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination?.hasPrevPage || isFetching}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </Button>

                {getPageNumbers().map((pageNum) => (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={
                      pageNum === pagination?.currentPage
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setPage(pageNum)}
                    disabled={isFetching}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination?.hasNextPage || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
