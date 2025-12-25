"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  countries,
  extractDialCode,
  getDefaultCountry,
  Country,
} from "@/lib/countries";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value = "",
  onChange,
  className,
  placeholder = "50 123 4567",
  disabled = false,
}: PhoneInputProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Parse the value to extract country code and number
  const parsePhoneValue = (val: string) => {
    if (!val) return { country: getDefaultCountry(), phoneNumber: "" };

    const matchingCountry = extractDialCode(val);
    if (matchingCountry) {
      return {
        country: matchingCountry,
        phoneNumber: val.slice(matchingCountry.dialCode.length).trim(),
      };
    }

    // Default to Saudi Arabia
    return {
      country: getDefaultCountry(),
      phoneNumber: val.replace(/^\+?966\s?/, ""),
    };
  };

  const { country: initialCountry, phoneNumber: initialNumber } =
    parsePhoneValue(value);
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const searchLower = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.nameAr.includes(search) ||
        c.dialCode.includes(search) ||
        c.code.toLowerCase().includes(searchLower),
    );
  }, [search]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearch("");
    if (phoneNumber) {
      onChange?.(`${country.dialCode}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNumber = e.target.value.replace(/[^0-9]/g, "");

    // Remove leading 0 from phone number (e.g., Egypt: 01060257232 -> 1060257232)
    // The country code already includes the prefix
    if (newNumber.startsWith("0")) {
      newNumber = newNumber.slice(1);
    }

    setPhoneNumber(newNumber);
    if (newNumber) {
      onChange?.(`${selectedCountry.dialCode}${newNumber}`);
    } else {
      onChange?.("");
    }
  };

  return (
    <div className={cn("flex gap-2", className)} dir="ltr">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-[120px] shrink-0 justify-between px-3"
          >
            <span className="flex items-center gap-1">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-xs text-gray-500">
                {selectedCountry.dialCode}
              </span>
            </span>
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={
                language === "ar" ? "ابحث عن دولة..." : "Search country..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-1">
              {filteredCountries.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  {language === "ar"
                    ? "لم يتم العثور على نتائج"
                    : "No results found"}
                </p>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountryChange(country)}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm",
                      selectedCountry.code === country.code && "bg-accent",
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-start">
                      {language === "ar" ? country.nameAr : country.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {country.dialCode}
                    </span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        dir="ltr"
      />
    </div>
  );
}
