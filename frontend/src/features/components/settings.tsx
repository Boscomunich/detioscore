import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { ModeToggle } from "./toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center justify-center p-3 rounded-xl transition-all duration-200 active:scale-95 group text-white">
          <Settings className="size-6 transition-transform duration-200 group-hover:rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-xl p-3 mr-4 mt-2 md:mt-4 dark:bg-gray-900/95 dark:border-gray-700/50"
        align="start"
      >
        <DropdownMenuLabel className="px-3 py-4 text-base font-semibold">
          Settings
        </DropdownMenuLabel>

        <DropdownMenuGroup className="space-y-1 p-1">
          {user && (
            <DropdownMenuItem
              className={cn(
                "flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-brand/400 dark:focus:bg-brand/10 dark:focus:text-brand/400",
                !user && "hidden"
              )}
              onClick={() => navigate("/profile")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand/50 to-brand/60 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span>Profile</span>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus:bg-gray-800 dark:focus:text-gray-100">
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
