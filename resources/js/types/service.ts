import type { IconName } from "@/components/ui/Icon"

export type Service = {
  slug: string
  icon: IconName
  title: string
  desc: string
  bullets: string[]
  tech: string[]
  detail: string
}
