// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Globe, MapPin, Search } from "lucide-react"
// import { Input } from "@/components/ui/input"

import { useEffect } from "react";

export default function LeaderboardPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["rankings", type, scope, limit],
    queryFn: fetchRankings,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.context?.totalPages ?? 1;
      const currentPage = allPages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  // const [scope, setScope] = useState<"world" | "country">("world")
  // const [selectedCountry, setSelectedCountry] = useState("USA")
  // const [searchQuery, setSearchQuery] = useState("")

  // const filteredData = data.filter((item) => {
  //   if (scope === "country" && item.country !== selectedCountry) return false
  //   if (searchQuery && !item.username.toLowerCase().includes(searchQuery.toLowerCase())) return false
  //   return true
  // })

  // // Sort data based on points for the "Overall" view (default)
  // const sortedData = [...filteredData].sort((a, b) => b.points - a.points)
  // const topThree = sortedData.slice(0, 3)
  // const restOfLeaderboard = sortedData.slice(3)

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12 space-y-8">
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Track top performers across the globe and in your country.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
          <button
            onClick={() => setScope("world")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              scope === "world"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-4 h-4" />
            World
          </button>
          <button
            onClick={() => setScope("country")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              scope === "country"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Country
          </button>
        </div>
      </div>

      {scope === "country" && (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium whitespace-nowrap">Select Country:</span>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
              <SelectItem value="Brazil">Brazil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Tabs defaultValue="overall" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <TabsList className="h-12 p-1 bg-muted/50 border">
            <TabsTrigger value="overall" className="px-6 h-10">
              Overall
            </TabsTrigger>
            <TabsTrigger value="topscore" className="px-6 h-10">
              Top Score
            </TabsTrigger>
            <TabsTrigger value="mangoset" className="px-6 h-10">
              ManGoSet
            </TabsTrigger>
            <TabsTrigger value="league" className="px-6 h-10">
              League
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="overall" className="space-y-8">
          <TopThreeCards data={topThree} type="Overall" />
          <Card>
            <CardHeader>
              <CardTitle>Overall Rankings</CardTitle>
              <CardDescription>Global performance across all competition categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={restOfLeaderboard} type="overall" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topscore" className="space-y-8">
          <TopThreeCards data={topThree} type="Top Score" />
          <Card>
            <CardHeader>
              <CardTitle>Top Score Rankings</CardTitle>
              <CardDescription>Highest individual scores achieved in competition.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={restOfLeaderboard} type="topScore" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mangoset" className="space-y-8">
          <TopThreeCards data={topThree} type="ManGoSet" />
          <Card>
            <CardHeader>
              <CardTitle>ManGoSet Rankings</CardTitle>
              <CardDescription>Leaders in the ManGoSet tactical challenge.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={restOfLeaderboard} type="manGoSet" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="league" className="space-y-8">
          <TopThreeCards data={topThree} type="League" />
          <Card>
            <CardHeader>
              <CardTitle>League Rankings</CardTitle>
              <CardDescription>Current standings in the competitive league.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={restOfLeaderboard} type="league" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
