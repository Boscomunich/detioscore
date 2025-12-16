import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { useNavigate } from "react-router";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import type { Competition } from "@/types/competition";

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

  // Filters
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [type, setType] = useState<string | undefined>(undefined);

  // Date Ranges
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [endDateFrom, setEndDateFrom] = useState("");
  const [endDateTo, setEndDateTo] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<CompetitionsResponse>({
      queryKey: [
        "active competitions",
        page,
        sortBy,
        sortOrder,
        type,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
      ],
      queryFn: async () => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (type && type !== "__clear") params.append("type", type);
        if (startDateFrom) params.append("startDateFrom", startDateFrom);
        if (startDateTo) params.append("startDateTo", startDateTo);
        if (endDateFrom) params.append("endDateFrom", endDateFrom);
        if (endDateTo) params.append("endDateTo", endDateTo);

        const res = await authApiClient.get(
          `/competition/active-competition?${params.toString()}`
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
    const visible = 5;

    let start = Math.max(1, currentPage - Math.floor(visible / 2));
    let end = start + visible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const clearFilters = () => {
    setType(undefined);
    setStartDateFrom("");
    setStartDateTo("");
    setEndDateFrom("");
    setEndDateTo("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Sort By */}
        <div>
          <label className="text-sm text-muted-foreground">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="endDate">End Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="text-sm text-muted-foreground">Order</label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Competition Type */}
        <div>
          <label className="text-sm text-muted-foreground">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TopScore">TopScore</SelectItem>
              <SelectItem value="ManGoSet">ManGoSet</SelectItem>
              <SelectItem value="League">League</SelectItem>
              <SelectItem value="__clear">Clear Filter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div>
          <label className="text-sm text-muted-foreground">
            Start Date (From)
          </label>
          <Input
            type="date"
            value={startDateFrom}
            onChange={(e) => setStartDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">
            Start Date (To)
          </label>
          <Input
            type="date"
            value={startDateTo}
            onChange={(e) => setStartDateTo(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">
            End Date (From)
          </label>
          <Input
            type="date"
            value={endDateFrom}
            onChange={(e) => setEndDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">End Date (To)</label>
          <Input
            type="date"
            value={endDateTo}
            onChange={(e) => setEndDateTo(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button variant="outline" onClick={clearFilters}>
          Reset Filters
        </Button>
      </div>

      {/* Results */}
      <Card>
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground">
              Failed to load competitions.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {competitions.map((comp) => (
                    <TableRow
                      key={comp._id}
                      className="cursor-pointer"
                      onClick={() => navigate(comp._id)}
                    >
                      <TableCell>{comp.name}</TableCell>
                      <TableCell>{comp.type}</TableCell>
                      <TableCell>
                        {comp.startDate
                          ? new Date(comp.startDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {comp.endDate
                          ? new Date(comp.endDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {pagination?.currentPage} of {pagination?.totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination?.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
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
                  >
                    {num}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination?.hasNextPage}
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
