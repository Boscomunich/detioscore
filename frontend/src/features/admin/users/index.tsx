import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import type { User } from "@/types/user";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreVertical, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<UsersResponse>({
      queryKey: ["users", page, sortBy, sortOrder],
      queryFn: async () => {
        const res = await authApiClient.get(
          `/admin?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        return res.data as UsersResponse;
      },
      enabled: !queryValue, // disable list when searching 1 user
      placeholderData: (prev) => prev,
    });

  const {
    data: singleUser,
    isFetching: fetchingSingle,
    error: singleError,
  } = useQuery({
    queryKey: ["single-user", queryValue],
    queryFn: async () => {
      const res = await authApiClient.get(`/admin/user?query=${queryValue}`);
      return res.data.user;
    },
    enabled: !!queryValue,
    retry: false,
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  //search handlers
  const startSearch = () => {
    if (!searchValue.trim()) return;
    setQueryValue(searchValue.trim());
  };

  const resetSearch = () => {
    setQueryValue("");
    setSearchValue("");
    refetch();
  };

  //pagination helpers
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
            Users
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/*SEARCH BAR */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="flex items-center bg-muted px-3 py-2 rounded-md w-full">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email or user ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <Button onClick={startSearch}>Search</Button>

        {queryValue && (
          <Button variant="ghost" onClick={resetSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sorting Controls */}
      {!queryValue && (
        <div className="flex items-center gap-6">
          {/* Sort Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Joined</SelectItem>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="lastLogin">Last Login</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Order</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Card>
        {/* LOADING */}
        {(isLoading || isFetching || fetchingSingle) && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ERROR STATES */}
        {singleError && queryValue && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground">No user found</p>
            <Button className="mt-2" variant="outline" onClick={resetSearch}>
              Reset
            </Button>
          </div>
        )}

        {isError && !queryValue && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground">Failed to load users.</p>
            <Button className="mt-2" variant="outline" onClick={() => refetch}>
              Retry
            </Button>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !fetchingSingle && !isError && (
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
                  {(queryValue ? [singleUser] : users)?.map((user: any) =>
                    user ? (
                      <TableRow
                        key={user._id}
                        onClick={() => navigate(user._id, { state: user })}
                      >
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">
                          {user.role}
                        </TableCell>
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
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </div>

            {/* PAGINATION — hidden when searching */}
            {!queryValue && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-border gap-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination?.currentPage} of {pagination?.totalPages} •{" "}
                  {pagination?.totalUsers} users
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
            )}
          </>
        )}
      </Card>
    </div>
  );
}
