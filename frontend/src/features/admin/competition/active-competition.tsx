import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Competition } from "@/types/competition";
import { useNavigate } from "react-router";

interface CompetitionsResponse {
  competitions: Competition[];
  pagination: {
    totalCompetitions: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function ActiveCompetitions() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<CompetitionsResponse>({
      queryKey: ["competitions", page],
      queryFn: async () => {
        const res = await authApiClient.get(
          `/competition/active-competition?page=${page}&limit=${limit}`
        );
        return res.data as CompetitionsResponse;
      },
      placeholderData: (prev) => prev,
    });

  const competitions = data?.competitions ?? [];
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
      <Card>
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Failed to load competitions.
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

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {competitions.map((comp) => (
                    <TableRow
                      key={comp._id}
                      onClick={() => navigate(comp._id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{comp.name}</TableCell>
                      <TableCell className="capitalize">{comp.type}</TableCell>
                      <TableCell>{comp.createdBy || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={comp.isActive ? "default" : "secondary"}
                        >
                          {comp.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {comp.startDate
                          ? new Date(comp.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {comp.endDate
                          ? new Date(comp.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
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
                {pagination?.totalCompetitions} competitions
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

                {getPageNumbers().map((num) => (
                  <Button
                    key={num}
                    size="sm"
                    variant={
                      num === pagination?.currentPage ? "default" : "outline"
                    }
                    onClick={() => setPage(num)}
                    disabled={isFetching}
                  >
                    {num}
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
