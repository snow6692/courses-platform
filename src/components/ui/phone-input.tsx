"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+962", country: "JO", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", country: "LB", flag: "🇱🇧", name: "Lebanon" },
  { code: "+963", country: "SY", flag: "🇸🇾", name: "Syria" },
  { code: "+964", country: "IQ", flag: "🇮🇶", name: "Iraq" },
  { code: "+967", country: "YE", flag: "🇾🇪", name: "Yemen" },
  { code: "+212", country: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "+213", country: "DZ", flag: "🇩🇿", name: "Algeria" },
  { code: "+216", country: "TN", flag: "🇹🇳", name: "Tunisia" },
  { code: "+218", country: "LY", flag: "🇱🇾", name: "Libya" },
  { code: "+249", country: "SD", flag: "🇸🇩", name: "Sudan" },
  { code: "+970", country: "PS", flag: "🇵🇸", name: "Palestine" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
];

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
  // Parse the value to extract country code and number
  const parsePhoneValue = (val: string) => {
    if (!val) return { countryCode: "+966", phoneNumber: "" };

    // Find matching country code
    const matchingCode = COUNTRY_CODES.find((c) => val.startsWith(c.code));
    if (matchingCode) {
      return {
        countryCode: matchingCode.code,
        phoneNumber: val.slice(matchingCode.code.length).trim(),
      };
    }

    // Default to Saudi Arabia
    return { countryCode: "+966", phoneNumber: val.replace(/^\+?966\s?/, "") };
  };

  const { countryCode: initialCode, phoneNumber: initialNumber } =
    parsePhoneValue(value);
  const [countryCode, setCountryCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (phoneNumber) {
      onChange?.(`${newCode}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(newNumber);
    if (newNumber) {
      onChange?.(`${countryCode}${newNumber}`);
    } else {
      onChange?.("");
    }
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);

  return (
    <div className={cn("flex gap-2", className)} dir="ltr">
      <Select
        value={countryCode}
        onValueChange={handleCountryChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[110px] shrink-0">
          <SelectValue>
            {selectedCountry && (
              <span className="flex items-center gap-1">
                <span>{selectedCountry.flag}</span>
                <span className="text-xs text-gray-500">
                  {selectedCountry.code}
                </span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-xs text-gray-500">{country.code}</span>
                <span className="text-xs">{country.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
