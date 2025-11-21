// import type React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Crown, Medal } from "lucide-react";
// import { cn } from "@/lib/utils";
// import type { RankData } from "@/lib/mock-data";

// interface TopThreeCardsProps {
//   data: RankData[];
//   type: string;
// }

// export function TopThreeCards({ data, type }: TopThreeCardsProps) {
//   // Ensure we have 3 items even if data is short
//   const [first, second, third] = [data[0], data[1], data[2]];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-end mb-8">
//       {/* Second Place */}
//       <div className="order-2 md:order-1">
//         <RankCard
//           player={second}
//           rank={2}
//           icon={<Medal className="w-6 h-6 text-slate-400" />}
//           color="border-slate-200 dark:border-slate-700"
//           bg="bg-slate-50 dark:bg-slate-900/50"
//         />
//       </div>

//       {/* First Place */}
//       <div className="order-1 md:order-2 -mt-8 md:-mt-12 z-10">
//         <RankCard
//           player={first}
//           rank={1}
//           icon={<Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />}
//           color="border-yellow-200 dark:border-yellow-800"
//           bg="bg-yellow-50 dark:bg-yellow-950/30"
//           isFirst
//         />
//       </div>

//       {/* Third Place */}
//       <div className="order-3 md:order-3">
//         <RankCard
//           player={third}
//           rank={3}
//           icon={<Medal className="w-6 h-6 text-amber-700" />}
//           color="border-amber-200 dark:border-amber-900"
//           bg="bg-amber-50 dark:bg-amber-950/30"
//         />
//       </div>
//     </div>
//   );
// }

// function RankCard({
//   player,
//   rank,
//   icon,
//   color,
//   bg,
//   isFirst = false,
// }: {
//   player: RankData | undefined;
//   rank: number;
//   icon: React.ReactNode;
//   color: string;
//   bg: string;
//   isFirst?: boolean;
// }) {
//   if (!player) return null;

//   return (
//     <Card
//       className={cn(
//         "relative overflow-hidden border-2 transition-all hover:scale-105",
//         color,
//         bg
//       )}
//     >
//       <div
//         className={cn(
//           "absolute top-0 right-0 p-3 opacity-10",
//           isFirst ? "scale-150" : "scale-100"
//         )}
//       >
//         {icon}
//       </div>
//       <CardContent className="flex flex-col items-center p-6 text-center">
//         <div className="relative mb-4">
//           <Avatar
//             className={cn(
//               "border-4",
//               isFirst ? "w-24 h-24 border-yellow-500" : "w-20 h-20 border-muted"
//             )}
//           >
//             <AvatarImage
//               src={`/ceholder-svg-key-6vpmh-height-.jpg?key=6vpmh&height=${
//                 isFirst ? 96 : 80
//               }&width=${isFirst ? 96 : 80}&query=${player.username}`}
//             />
//             <AvatarFallback>
//               {player.username.slice(0, 2).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background border shadow-sm rounded-full p-1.5">
//             {icon}
//           </div>
//         </div>

//         <div className="mt-2 space-y-1">
//           <h3
//             className={cn(
//               "font-bold truncate max-w-[150px]",
//               isFirst ? "text-xl" : "text-lg"
//             )}
//           >
//             {player.username}
//           </h3>
//           <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
//             {player.country}
//           </p>
//         </div>

//         <div className="mt-4 grid grid-cols-2 gap-4 w-full text-sm">
//           <div className="flex flex-col">
//             <span className="text-muted-foreground text-xs uppercase tracking-wider">
//               Points
//             </span>
//             <span className="font-bold font-mono text-lg">
//               {player.points.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-muted-foreground text-xs uppercase tracking-wider">
//               Wins
//             </span>
//             <span className="font-bold font-mono text-lg">
//               {player.totalWins}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
