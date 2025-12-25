// Country data with code, name, and flag emoji
export interface Country {
  code: string;
  name: string;
  nameAr: string;
  dialCode: string;
  flag: string;
}

// Arab countries first, then sorted alphabetically
export const countries: Country[] = [
  // Arab countries (prioritized)
  {
    code: "SA",
    name: "Saudi Arabia",
    nameAr: "السعودية",
    dialCode: "+966",
    flag: "🇸🇦",
  },
  { code: "EG", name: "Egypt", nameAr: "مصر", dialCode: "+20", flag: "🇪🇬" },
  {
    code: "AE",
    name: "United Arab Emirates",
    nameAr: "الإمارات",
    dialCode: "+971",
    flag: "🇦🇪",
  },
  {
    code: "KW",
    name: "Kuwait",
    nameAr: "الكويت",
    dialCode: "+965",
    flag: "🇰🇼",
  },
  { code: "QA", name: "Qatar", nameAr: "قطر", dialCode: "+974", flag: "🇶🇦" },
  {
    code: "BH",
    name: "Bahrain",
    nameAr: "البحرين",
    dialCode: "+973",
    flag: "🇧🇭",
  },
  { code: "OM", name: "Oman", nameAr: "عمان", dialCode: "+968", flag: "🇴🇲" },
  {
    code: "JO",
    name: "Jordan",
    nameAr: "الأردن",
    dialCode: "+962",
    flag: "🇯🇴",
  },
  {
    code: "LB",
    name: "Lebanon",
    nameAr: "لبنان",
    dialCode: "+961",
    flag: "🇱🇧",
  },
  {
    code: "PS",
    name: "Palestine",
    nameAr: "فلسطين",
    dialCode: "+970",
    flag: "🇵🇸",
  },
  { code: "IQ", name: "Iraq", nameAr: "العراق", dialCode: "+964", flag: "🇮🇶" },
  { code: "SY", name: "Syria", nameAr: "سوريا", dialCode: "+963", flag: "🇸🇾" },
  { code: "YE", name: "Yemen", nameAr: "اليمن", dialCode: "+967", flag: "🇾🇪" },
  { code: "LY", name: "Libya", nameAr: "ليبيا", dialCode: "+218", flag: "🇱🇾" },
  { code: "TN", name: "Tunisia", nameAr: "تونس", dialCode: "+216", flag: "🇹🇳" },
  {
    code: "DZ",
    name: "Algeria",
    nameAr: "الجزائر",
    dialCode: "+213",
    flag: "🇩🇿",
  },
  {
    code: "MA",
    name: "Morocco",
    nameAr: "المغرب",
    dialCode: "+212",
    flag: "🇲🇦",
  },
  {
    code: "SD",
    name: "Sudan",
    nameAr: "السودان",
    dialCode: "+249",
    flag: "🇸🇩",
  },
  {
    code: "MR",
    name: "Mauritania",
    nameAr: "موريتانيا",
    dialCode: "+222",
    flag: "🇲🇷",
  },
  {
    code: "SO",
    name: "Somalia",
    nameAr: "الصومال",
    dialCode: "+252",
    flag: "🇸🇴",
  },
  {
    code: "DJ",
    name: "Djibouti",
    nameAr: "جيبوتي",
    dialCode: "+253",
    flag: "🇩🇯",
  },
  {
    code: "KM",
    name: "Comoros",
    nameAr: "جزر القمر",
    dialCode: "+269",
    flag: "🇰🇲",
  },

  // Other popular countries
  {
    code: "US",
    name: "United States",
    nameAr: "الولايات المتحدة",
    dialCode: "+1",
    flag: "🇺🇸",
  },
  {
    code: "GB",
    name: "United Kingdom",
    nameAr: "المملكة المتحدة",
    dialCode: "+44",
    flag: "🇬🇧",
  },
  { code: "TR", name: "Turkey", nameAr: "تركيا", dialCode: "+90", flag: "🇹🇷" },
  {
    code: "PK",
    name: "Pakistan",
    nameAr: "باكستان",
    dialCode: "+92",
    flag: "🇵🇰",
  },
  { code: "IN", name: "India", nameAr: "الهند", dialCode: "+91", flag: "🇮🇳" },
  {
    code: "BD",
    name: "Bangladesh",
    nameAr: "بنغلاديش",
    dialCode: "+880",
    flag: "🇧🇩",
  },
  {
    code: "ID",
    name: "Indonesia",
    nameAr: "إندونيسيا",
    dialCode: "+62",
    flag: "🇮🇩",
  },
  {
    code: "MY",
    name: "Malaysia",
    nameAr: "ماليزيا",
    dialCode: "+60",
    flag: "🇲🇾",
  },
  {
    code: "PH",
    name: "Philippines",
    nameAr: "الفلبين",
    dialCode: "+63",
    flag: "🇵🇭",
  },

  // European countries
  {
    code: "DE",
    name: "Germany",
    nameAr: "ألمانيا",
    dialCode: "+49",
    flag: "🇩🇪",
  },
  { code: "FR", name: "France", nameAr: "فرنسا", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", nameAr: "إيطاليا", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", nameAr: "إسبانيا", dialCode: "+34", flag: "🇪🇸" },
  {
    code: "NL",
    name: "Netherlands",
    nameAr: "هولندا",
    dialCode: "+31",
    flag: "🇳🇱",
  },
  {
    code: "BE",
    name: "Belgium",
    nameAr: "بلجيكا",
    dialCode: "+32",
    flag: "🇧🇪",
  },
  { code: "SE", name: "Sweden", nameAr: "السويد", dialCode: "+46", flag: "🇸🇪" },
  {
    code: "NO",
    name: "Norway",
    nameAr: "النرويج",
    dialCode: "+47",
    flag: "🇳🇴",
  },
  {
    code: "DK",
    name: "Denmark",
    nameAr: "الدنمارك",
    dialCode: "+45",
    flag: "🇩🇰",
  },
  {
    code: "FI",
    name: "Finland",
    nameAr: "فنلندا",
    dialCode: "+358",
    flag: "🇫🇮",
  },
  {
    code: "AT",
    name: "Austria",
    nameAr: "النمسا",
    dialCode: "+43",
    flag: "🇦🇹",
  },
  {
    code: "CH",
    name: "Switzerland",
    nameAr: "سويسرا",
    dialCode: "+41",
    flag: "🇨🇭",
  },
  { code: "PL", name: "Poland", nameAr: "بولندا", dialCode: "+48", flag: "🇵🇱" },
  {
    code: "PT",
    name: "Portugal",
    nameAr: "البرتغال",
    dialCode: "+351",
    flag: "🇵🇹",
  },
  {
    code: "GR",
    name: "Greece",
    nameAr: "اليونان",
    dialCode: "+30",
    flag: "🇬🇷",
  },
  {
    code: "IE",
    name: "Ireland",
    nameAr: "أيرلندا",
    dialCode: "+353",
    flag: "🇮🇪",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    nameAr: "التشيك",
    dialCode: "+420",
    flag: "🇨🇿",
  },
  {
    code: "RO",
    name: "Romania",
    nameAr: "رومانيا",
    dialCode: "+40",
    flag: "🇷🇴",
  },
  { code: "HU", name: "Hungary", nameAr: "المجر", dialCode: "+36", flag: "🇭🇺" },
  { code: "RU", name: "Russia", nameAr: "روسيا", dialCode: "+7", flag: "🇷🇺" },
  {
    code: "UA",
    name: "Ukraine",
    nameAr: "أوكرانيا",
    dialCode: "+380",
    flag: "🇺🇦",
  },

  // Asian countries
  { code: "CN", name: "China", nameAr: "الصين", dialCode: "+86", flag: "🇨🇳" },
  { code: "JP", name: "Japan", nameAr: "اليابان", dialCode: "+81", flag: "🇯🇵" },
  {
    code: "KR",
    name: "South Korea",
    nameAr: "كوريا الجنوبية",
    dialCode: "+82",
    flag: "🇰🇷",
  },
  {
    code: "TH",
    name: "Thailand",
    nameAr: "تايلاند",
    dialCode: "+66",
    flag: "🇹🇭",
  },
  {
    code: "VN",
    name: "Vietnam",
    nameAr: "فيتنام",
    dialCode: "+84",
    flag: "🇻🇳",
  },
  {
    code: "SG",
    name: "Singapore",
    nameAr: "سنغافورة",
    dialCode: "+65",
    flag: "🇸🇬",
  },
  {
    code: "HK",
    name: "Hong Kong",
    nameAr: "هونغ كونغ",
    dialCode: "+852",
    flag: "🇭🇰",
  },
  {
    code: "TW",
    name: "Taiwan",
    nameAr: "تايوان",
    dialCode: "+886",
    flag: "🇹🇼",
  },
  { code: "IR", name: "Iran", nameAr: "إيران", dialCode: "+98", flag: "🇮🇷" },
  {
    code: "AF",
    name: "Afghanistan",
    nameAr: "أفغانستان",
    dialCode: "+93",
    flag: "🇦🇫",
  },

  // Americas
  { code: "CA", name: "Canada", nameAr: "كندا", dialCode: "+1", flag: "🇨🇦" },
  {
    code: "MX",
    name: "Mexico",
    nameAr: "المكسيك",
    dialCode: "+52",
    flag: "🇲🇽",
  },
  {
    code: "BR",
    name: "Brazil",
    nameAr: "البرازيل",
    dialCode: "+55",
    flag: "🇧🇷",
  },
  {
    code: "AR",
    name: "Argentina",
    nameAr: "الأرجنتين",
    dialCode: "+54",
    flag: "🇦🇷",
  },
  { code: "CL", name: "Chile", nameAr: "تشيلي", dialCode: "+56", flag: "🇨🇱" },
  {
    code: "CO",
    name: "Colombia",
    nameAr: "كولومبيا",
    dialCode: "+57",
    flag: "🇨🇴",
  },

  // Africa
  {
    code: "ZA",
    name: "South Africa",
    nameAr: "جنوب أفريقيا",
    dialCode: "+27",
    flag: "🇿🇦",
  },
  {
    code: "NG",
    name: "Nigeria",
    nameAr: "نيجيريا",
    dialCode: "+234",
    flag: "🇳🇬",
  },
  { code: "KE", name: "Kenya", nameAr: "كينيا", dialCode: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", nameAr: "غانا", dialCode: "+233", flag: "🇬🇭" },
  {
    code: "ET",
    name: "Ethiopia",
    nameAr: "إثيوبيا",
    dialCode: "+251",
    flag: "🇪🇹",
  },

  // Oceania
  {
    code: "AU",
    name: "Australia",
    nameAr: "أستراليا",
    dialCode: "+61",
    flag: "🇦🇺",
  },
  {
    code: "NZ",
    name: "New Zealand",
    nameAr: "نيوزيلندا",
    dialCode: "+64",
    flag: "🇳🇿",
  },
];

// Get default country (Saudi Arabia)
export const getDefaultCountry = () => countries[0];

// Find country by dial code
export const findCountryByDialCode = (dialCode: string) =>
  countries.find((c) => c.dialCode === dialCode);

// Find country by code
export const findCountryByCode = (code: string) =>
  countries.find((c) => c.code === code);

// Extract dial code from phone number
export const extractDialCode = (phoneNumber: string) => {
  if (!phoneNumber.startsWith("+")) return null;

  // Try to match dial codes (longest first)
  const sortedCountries = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );
  for (const country of sortedCountries) {
    if (phoneNumber.startsWith(country.dialCode)) {
      return country;
    }
  }
  return null;
};
