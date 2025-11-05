import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { countries } from "countries-list";
import ReactCountryFlag from "react-country-flag";

const COUNTRIES = Object.entries(countries).map(([code, data]) => ({
  code,
  label: data.name,
}));

export interface CountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const CountrySelect = React.forwardRef<
  HTMLButtonElement,
  CountrySelectProps
>(({ value, onValueChange, placeholder = "Select a country..." }, ref) => {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = COUNTRIES.find((c) => c.label === value);

  const handleSelect = (countryName: string) => {
    onValueChange?.(countryName); // ✅ send full name to form
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <span className="flex items-center gap-2">
            {selectedCountry && (
              <ReactCountryFlag
                countryCode={selectedCountry.code}
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              />
            )}
            <span className={selectedCountry ? "" : "text-muted-foreground"}>
              {selectedCountry?.label || placeholder}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.label}
                  onSelect={() => handleSelect(country.label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      marginRight: "0.5em",
                    }}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
