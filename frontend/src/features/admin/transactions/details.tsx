import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  Hash,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import type { Transaction } from "@/types/transaction";
import { useMutation } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { toast } from "sonner";

export function TransactionDetailView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const transaction = state as Transaction;

  //Track which button is loading ("confirm" | "cancel" | null)
  const [loadingAction, setLoadingAction] = useState<
    "confirm" | "cancel" | null
  >(null);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.patch(
        `/admin/transaction/${transaction.user}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transaction updated successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong while updating the transaction.");
      console.error(error);
    },
  });

  const handleConfirm = async () => {
    setLoadingAction("confirm");
    mutation.mutate(
      { status: "completed", txnId: transaction._id },
      { onSettled: () => setLoadingAction(null) } // Reset loading state
    );
  };

  const handleCancel = async () => {
    setLoadingAction("cancel");
    mutation.mutate(
      { status: "failed", txnId: transaction._id },
      { onSettled: () => setLoadingAction(null) }
    );
  };

  const status = transaction.status;
  const createdAt = new Date(transaction.createdAt);
  const date = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Button>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Transaction Details
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage transaction information
            </p>
          </div>
        </div>

        {/* 🔹 Action Buttons */}
        {status === "pending" && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!!loadingAction}
              className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              {loadingAction === "cancel" ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Cancel
                </>
              )}
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!!loadingAction}
              className="gap-2 bg-primary"
            >
              {loadingAction === "confirm" ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div>
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="mt-1 text-lg font-mono font-medium text-foreground">
                {transaction._id}
              </p>
            </div>
            <Badge
              variant={
                status === "completed"
                  ? "default"
                  : status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="flex w-fit items-center gap-1 capitalize"
            >
              {status === "completed" && <CheckCircle className="h-3 w-3" />}
              {status === "pending" && <Clock className="h-3 w-3" />}
              {status === "failed" && <XCircle className="h-3 w-3" />}
              {status}
            </Badge>
          </div>

          <div className="h-px bg-border" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="mt-1 text-base capitalize text-foreground">
                  {transaction.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <div className="mt-1 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base text-foreground">
                    {transaction.paymentMethod ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base text-foreground">
                    {date} at {time}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <div className="mt-1 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base font-mono text-foreground">
                    {transaction._id ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1 text-base text-foreground">
              {transaction.description ?? "No description provided."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
