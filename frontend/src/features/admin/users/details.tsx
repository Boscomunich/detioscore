import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { Loader2, UserCheck } from "lucide-react";

import type { Transaction } from "@/types/transaction";
import { TransactionTable } from "../components/transaction-table";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "react-router";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { BanDialog } from "./ban-user-popup";
import { SuspendDialog } from "./suspend-user-popup";
import { DeleteUserDialog } from "./delete-user";
import { RoleDialog } from "./user-role";

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

export default function UserDetailView() {
  const { userId } = useParams();
  const { state } = useLocation();
  const user = state as User;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.patch(`/admin/${user._id}/${data.route}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("action is successfully!");
    },
    onError: (error) => {
      toast.error("action failed.");
      console.error(error);
    },
  });

  const handleUnban = () => {
    mutation.mutate({ route: "unban" });
  };

  const handleUnsuspend = () => {
    mutation.mutate({ route: "unsuspend" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {user.username}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant={user.emailVerified ? "outline" : "destructive"}>
          {user.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>

      {/* Action Buttons */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {user.banned ? (
            <Button
              onClick={handleUnban}
              disabled={mutation.isPending}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <UserCheck className="h-4 w-4" />
              Unban User
            </Button>
          ) : (
            <BanDialog user={user} />
          )}

          {user.suspended ? (
            <Button
              onClick={handleUnsuspend}
              disabled={mutation.isPending}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <UserCheck className="h-4 w-4" />
              Unsuspend User
            </Button>
          ) : (
            <SuspendDialog user={user} />
          )}
          <DeleteUserDialog user={user} />
          <RoleDialog user={user} />
        </div>
      </Card>

      {/* User Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            User Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-foreground">{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <UserTransactions userId={userId!} />
    </div>
  );
}

function UserTransactions({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<TransactionsResponse>({
      queryKey: ["transactions", page],
      queryFn: async () => {
        const res = await authApiClient.get(
          `/admin/transaction/${userId}?page=${page}`
        );
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
            Manage user {userId} transactions
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
