import { Moon, Sun } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "../hooks/use-theme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-8">
          <Sun className="h-5 w-5 text-yellow-500 dark:hidden" />
          <Moon className="h-5 w-5 text-blue-500 hidden dark:block" />
          <span className="font-semibold text-sm">Select Theme</span>
        </div>
        <RadioGroup
          value={theme}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
          className="space-y-2"
        >
          {["light", "dark", "system"].map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem id={value} value={value} />
              <Label htmlFor={value} className="capitalize">
                {value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
