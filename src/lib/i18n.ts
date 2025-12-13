import { cookies } from "next/headers";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export type Locale = "ar" | "en";

const dictionaries = {
  ar,
  en,
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;

  if (locale === "en") {
    return "en";
  }

  // Default to Arabic
  return "ar";
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export async function getServerLocale() {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return {
    locale,
    t: (key: string) => {
      const value = key
        .split(".")
        .reduce((acc: any, part: string) => acc?.[part], dictionary);
      return value ?? key;
    },
    dir: locale === "ar" ? "rtl" : "ltr",
  };
}
