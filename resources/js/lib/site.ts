/** Brand spellings used across the public site: Latin "AMTDEX SOFT", Arabic "امتدكس سوفت". */
export const BRAND_LATIN = "AMTDEX SOFT"
export const BRAND_ARABIC = "امتدكس سوفت"

const WHATSAPP_NUMBER = "967784440429"

/** WhatsApp chat link, optionally with a prefilled first message. */
export function whatsappUrl(message?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`
}
