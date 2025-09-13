import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { ModeToggle } from "./toggle";

export function SettingsPage() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings className="md:text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mr-8 mt-8 md:mt-20" align="start">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
