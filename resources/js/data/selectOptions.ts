import type { SearchSelectOption } from "@/components/ui/SearchSelect"
import { phoneCountries } from "@/lib/phone"

const flag = (code: string) => String.fromCodePoint(...Array.from(code.toUpperCase()).map(letter => 0x1f1e6 + letter.charCodeAt(0) - 65))
const english = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : undefined

/** Countries with their dialling code; searchable in Arabic, English, ISO code or digits. */
export const countryOptions: SearchSelectOption[] = phoneCountries.map(country => ({
  value: country.code,
  label: country.name,
  hint: `+${country.callingCode}`,
  icon: flag(country.code),
  keywords: `${english?.of(country.code) ?? ""} ${country.code} ${country.callingCode} 00${country.callingCode}`,
}))

const currencies: [code: string, name: string, symbol: string, keywords: string][] = [
  ["SAR", "ريال سعودي", "﷼", "Saudi riyal السعودية"],
  ["USD", "دولار أمريكي", "$", "US dollar أمريكا"],
  ["YER", "ريال يمني", "﷼", "Yemeni rial اليمن"],
  ["AED", "درهم إماراتي", "د.إ", "UAE dirham الإمارات"],
  ["EUR", "يورو", "€", "Euro أوروبا"],
  ["OMR", "ريال عماني", "ر.ع", "Omani rial عمان"],
  ["QAR", "ريال قطري", "ر.ق", "Qatari riyal قطر"],
  ["KWD", "دينار كويتي", "د.ك", "Kuwaiti dinar الكويت"],
  ["BHD", "دينار بحريني", "د.ب", "Bahraini dinar البحرين"],
  ["EGP", "جنيه مصري", "ج.م", "Egyptian pound مصر"],
  ["JOD", "دينار أردني", "د.أ", "Jordanian dinar الأردن"],
  ["IQD", "دينار عراقي", "د.ع", "Iraqi dinar العراق"],
  ["LBP", "ليرة لبنانية", "ل.ل", "Lebanese pound لبنان"],
  ["SYP", "ليرة سورية", "ل.س", "Syrian pound سوريا"],
  ["LYD", "دينار ليبي", "د.ل", "Libyan dinar ليبيا"],
  ["TND", "دينار تونسي", "د.ت", "Tunisian dinar تونس"],
  ["DZD", "دينار جزائري", "د.ج", "Algerian dinar الجزائر"],
  ["MAD", "درهم مغربي", "د.م", "Moroccan dirham المغرب"],
  ["SDG", "جنيه سوداني", "ج.س", "Sudanese pound السودان"],
  ["GBP", "جنيه إسترليني", "£", "British pound sterling بريطانيا"],
  ["TRY", "ليرة تركية", "₺", "Turkish lira تركيا"],
  ["CAD", "دولار كندي", "$", "Canadian dollar كندا"],
  ["AUD", "دولار أسترالي", "$", "Australian dollar أستراليا"],
  ["CHF", "فرنك سويسري", "Fr", "Swiss franc سويسرا"],
  ["CNY", "يوان صيني", "¥", "Chinese yuan renminbi الصين"],
  ["JPY", "ين ياباني", "¥", "Japanese yen اليابان"],
  ["INR", "روبية هندية", "₹", "Indian rupee الهند"],
  ["PKR", "روبية باكستانية", "₨", "Pakistani rupee باكستان"],
  ["MYR", "رينغيت ماليزي", "RM", "Malaysian ringgit ماليزيا"],
  ["IDR", "روبية إندونيسية", "Rp", "Indonesian rupiah إندونيسيا"],
]

/** Three-letter ISO codes only: the quote schema validates "amount CODE". */
export const currencyOptions: SearchSelectOption[] = currencies.map(([code, name, symbol, keywords]) => ({
  value: code, label: name, hint: code, icon: symbol, keywords,
}))
