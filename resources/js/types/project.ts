export type ProjectMetric = {
  v: string
  l: string
}

export type Project = {
  id?: number | string
  slug: string
  cat: string
  title: string
  client: string
  year: string
  stack: string[]
  color: string
  accent: string
  summary: string
  cover_image?: string
  cover_image_alt?: string
  gallery?: string[]
  challenge?: string
  deliverables?: string[]
  metrics?: ProjectMetric[]
  duration?: string
  team_size?: string
  project_url?: string
  meta_title?: string
  meta_description?: string
  og_image?: string
  sort_order?: number
  is_published?: boolean
}
