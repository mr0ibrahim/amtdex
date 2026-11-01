import type { SVGProps } from "react"

/** Amtdex's 24px outline set: rounded caps, consistent 1.7px stroke, inherited color. */
const paths = {
  web: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM3 8h18M6 6h.01M9 6h.01M9 11l-3 3 3 3m6-6 3 3-3 3m-2-7-2 8",
  mobile: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 0v3h6V2m-4 16h2",
  erp: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7ZM6 6h1m10 0h1M6 17h1m10 0h1",
  ai: "M7 7h10v10H7Zm3 3h4v4h-4ZM9 2v5m6-5v5M9 17v5m6-5v5M2 9h5m-5 6h5m10-6h5m-5 6h5",
  security: "M12 2 3 6v6c0 5 5 8 9 10 4-2 9-5 9-10V6ZM8 12l3 3 5-6",
  cloud: "M7 18H6a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8.5a4.8 4.8 0 0 1 .5 9.5H17m-8-4 3-3 3 3m-3-3v10",
  check: "m5 12 4 4L19 6",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
  arrowRight: "M4 12h16m-6-6 6 6-6 6",
  arrowUpLeft: "M18 18 6 6m0 9V6h9",
  quote: "M4 6h6v7H6c0 3-1 4-3 5m11-12h6v7h-4c0 3-1 4-3 5",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z",
  sparkles: "m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4m-2-2h4",
  play: "m9 5 11 7-11 7Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M18 6 6 18",
  x: "m6 6 12 12M18 6 6 18",
  mail: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm-1 2 9 7 9-7",
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18",
  launch: "M14 5c2-2 5-3 7-2 1 2 0 5-2 7l-7 7-5-5ZM7 12H3l3-6h6m0 11v4l6-3v-6m-13 4c-2 0-3 3-3 5 2 0 5-1 5-3M15 7h.01",
  folder: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm0 0h8",
  invoice: "M6 2h9l4 4v16l-3-2-4 2-4-2-3 2V3a1 1 0 0 1 1-1Zm8 0v5h5M8 11h8m-8 4h5",
  settings: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6M10 15v6",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  mapPin: "M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
  clock: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 5v5l4 2",
  alertCircle: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14h.01M12 8v4",
  shield: "M12 2 3 6v6c0 5 5 8 9 10 4-2 9-5 9-10V6Z",
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 24, ...props }: Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName; size?: number }) {
  const pathD = paths[name] || paths.settings
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="ui-icon"
      {...props}
    >
      <path d={pathD} />
    </svg>
  )
}
