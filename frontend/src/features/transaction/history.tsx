import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Filter,
  Calendar,
  CreditCard,
  Smartphone,
  Building2,
  Settings,
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Loader2,
} from "lucide-react";
import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/types/transaction";

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "topup":
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case "withdrawal":
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case "stake":
      return <TrendingDown className="h-4 w-4 text-blue-500" />;
    case "payout":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "card":
      return <CreditCard className="h-4 w-4" />;
    case "googlepay":
    case "applepay":
      return <Smartphone className="h-4 w-4" />;
    case "transfer":
      return <Building2 className="h-4 w-4" />;
    case "crypto":
      return <Bitcoin className="h-4 w-4 text-yellow-500" />;
    default:
      return <Settings className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatTransactionType = (type: string) => {
  switch (type) {
    case "topup":
      return "Deposit";
    case "withdrawal":
      return "Withdrawal";
    case "stake":
      return "Stake";
    case "payout":
      return "Payout";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const formatPaymentMethod = (method: string) => {
  switch (method) {
    case "card":
      return "Credit/Debit Card";
    case "googlepay":
      return "Google Pay";
    case "applepay":
      return "Apple Pay";
    case "transfer":
      return "Bank Transfer";
    case "system":
      return "System";
    case "crypto":
      return "Crypto";
    default:
      return method.charAt(0).toUpperCase() + method.slice(1);
  }
};

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  async function fetchData() {
    const response = await authApiClient.get("/transaction/history");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["transaction-history"],
    queryFn: fetchData,
  });

  useEffect(() => {
    let filtered = transactions;
    if (!filtered) return;

    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          formatTransactionType(transaction.type)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="min-h-screen h-full w-[98%] max-w-3xl flex justify-center items-start mx-auto border rounded-sm my-2 p-2 sm:p-4">
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-primary mb-2">
              Transaction History
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View and manage all your financial transactions in one place.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary text-sm sm:text-base">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-start items-center flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="topup">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="stake">Stakes</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="border-2 text-sm sm:text-base"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-base sm:text-lg">
                Recent Transactions
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions
              </p>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    No transactions found
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "Your transactions will appear here once you make your first deposit or withdrawal."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border-2 border-border rounded-lg hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">
                              {formatTransactionType(transaction.type)}
                            </h3>
                            <Badge
                              className={`text-[10px] sm:text-xs ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            {transaction.description ||
                              `${formatTransactionType(
                                transaction.type
                              )} transaction`}
                          </p>
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              {getPaymentMethodIcon(transaction.paymentMethod)}
                              {formatPaymentMethod(transaction.paymentMethod)}
                            </div>
                            <div className="font-mono">
                              ID: TXN-{transaction._id}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm sm:text-lg font-bold ${
                            transaction.type === "topup" ||
                            transaction.type === "payout"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "topup" ||
                          transaction.type === "payout"
                            ? "+"
                            : "-"}
                          ${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
