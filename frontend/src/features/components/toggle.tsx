import { Moon, Sun, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "../hooks/use-theme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <Card className="w-full max-w-xs border-0 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <PaletteIcon />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Theme
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose your preference
            </p>
          </div>
        </div>

        {/* Theme Options */}
        <RadioGroup
          value={theme}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
          className="space-y-3"
        >
          {themes.map(({ value, icon: Icon, label }) => (
            <div
              key={value}
              // 👇 Make the whole div clickable
              onClick={() => setTheme(value)}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer
                ${
                  theme === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                }`}
            >
              <RadioGroupItem
                id={value}
                value={value}
                className="text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pointer-events-none"
              />
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Label
                htmlFor={value}
                className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function PaletteIcon() {
  return (
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
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}
