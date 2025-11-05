import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import type { User } from "@/types/user";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";

interface UsersResponse {
  users: User[];
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function AllUsers() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<UsersResponse>({
      queryKey: ["users", page],
      queryFn: async () => {
        const res = await authApiClient.get(`/admin?page=${page}`);
        return res.data as UsersResponse;
      },
      placeholderData: (prev) => prev, // keep previous data during pagination
    });

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  // Generate a limited list of page numbers (for large page counts)
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
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      <Card>
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Failed to load users.</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user._id}
                      onClick={() => navigate(user._id, { state: user })}
                    >
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.emailVerified ? "outline" : "destructive"
                          }
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-border gap-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination?.currentPage} of {pagination?.totalPages} •{" "}
                {pagination?.totalUsers} users
              </p>

              {/**page buttons */}
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
