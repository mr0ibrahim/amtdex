import { useSyncExternalStore } from "react"
import type { Service } from "@/types/service"
import type { Project } from "@/types/project"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { PRICING as SEED_PRICING } from "@/data/pricing"

type PricingItem = (typeof SEED_PRICING)[number]

const KEYS = {
  services: "amtdex_content_services",
  projects: "amtdex_content_projects",
  pricing: "amtdex_content_pricing",
} as const

function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {}
  return seed
}
function save(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val))
  listeners.forEach((cb) => cb())
}
const listeners = new Set<() => void>()
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb) }

export function getServices(): Service[] { return load(KEYS.services, SEED_SERVICES) }
export function setServices(v: Service[]) { save(KEYS.services, v) }
export function upsertService(s: Service) {
  const arr = getServices()
  const idx = arr.findIndex((x: Service) => x.slug === s.slug)
  if (idx >= 0) arr[idx] = s
  else arr.push(s)
  setServices(arr)
}
export function deleteService(slug: string) { setServices(getServices().filter((x: Service) => x.slug !== slug)) }

export function getProjects(): Project[] { return load(KEYS.projects, SEED_PROJECTS) }
export function setProjects(v: Project[]) { save(KEYS.projects, v) }
export function upsertProject(p: Project) {
  const arr = getProjects()
  const idx = arr.findIndex((x: Project) => x.slug === p.slug)
  if (idx >= 0) arr[idx] = p
  else arr.push(p)
  setProjects(arr)
}
export function deleteProject(slug: string) { setProjects(getProjects().filter((x: Project) => x.slug !== slug)) }

export function getPricing(): PricingItem[] { return load(KEYS.pricing, SEED_PRICING as unknown as PricingItem[]) }
export function setPricing(v: PricingItem[]) { save(KEYS.pricing, v) }

export function useServices(): Service[] {
  return useSyncExternalStore(subscribe, () => getServices(), () => SEED_SERVICES)
}
export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, () => getProjects(), () => SEED_PROJECTS)
}
export function usePricing(): PricingItem[] {
  return useSyncExternalStore(subscribe, () => getPricing(), () => SEED_PRICING as unknown as PricingItem[])
}

export function resetContent() {
  localStorage.removeItem(KEYS.services)
  localStorage.removeItem(KEYS.projects)
  localStorage.removeItem(KEYS.pricing)
  listeners.forEach((cb) => cb())
}
