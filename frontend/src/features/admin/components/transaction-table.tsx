import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/types/transaction";
import { useNavigate } from "react-router";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((txn) => (
            <TableRow
              key={txn._id}
              onClick={() =>
                navigate(`/admin/transactions/${txn._id}`, { state: txn })
              }
              className="cursor-pointer"
            >
              <TableCell className="font-mono">{txn._id}</TableCell>
              <TableCell>{txn.type}</TableCell>
              <TableCell>${txn.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    txn.status === "completed"
                      ? "default"
                      : txn.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className="flex w-fit items-center gap-1 capitalize"
                >
                  {txn.status === "completed" && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  {txn.status === "pending" && <Clock className="h-3 w-3" />}
                  {txn.status === "failed" && <XCircle className="h-3 w-3" />}
                  {txn.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(txn.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
