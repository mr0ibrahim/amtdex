import type { IconName } from "@/components/ui/Icon"

export type Service = {
  id?: number | string
  slug: string
  icon: IconName
  title: string
  desc: string
  bullets: string[]
  tech: string[]
  detail?: string
  sort_order?: number
  is_published?: boolean
}
