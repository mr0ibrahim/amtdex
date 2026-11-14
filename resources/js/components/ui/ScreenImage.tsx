import type { ImgHTMLAttributes } from "react"
import { SCREEN_IMAGES } from "@/data/screenImages"

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & { screen: string }

/** Responsive AVIF with the existing WebP as a browser fallback. */
export function ScreenImage({ screen, sizes = "(max-width: 639px) 80vw, 40vw", ...props }: Props) {
  const optimized = SCREEN_IMAGES[screen as keyof typeof SCREEN_IMAGES]
  return <picture className="screen-picture">
    {optimized && <source type="image/avif" srcSet={`${optimized[480]} 480w, ${optimized[960]} 960w`} sizes={sizes} />}
    <img src={`/images/screens/${screen}-480.webp`} srcSet={`/images/screens/${screen}-480.webp 480w, /images/screens/${screen}.webp 960w`} sizes={sizes} decoding="async" {...props} />
  </picture>
}
