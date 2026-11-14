import { Icon } from "@/components/ui/Icon"
import { whatsappUrl } from "@/lib/site"

/** Always-reachable chat shortcut; the one secondary action next to "ابدأ مشروعك". */
export function WhatsAppButton() {
  return (
    <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="تواصل معنا عبر واتساب">
      <Icon name="whatsapp" size={26} />
      <span>واتساب</span>
    </a>
  )
}
