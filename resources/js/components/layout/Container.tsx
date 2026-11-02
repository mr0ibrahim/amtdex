import type { ElementType, HTMLAttributes, ReactNode } from "react"

type ContainerVariant = "marketing" | "wide" | "narrow"

const variantClass: Record<ContainerVariant, string> = {
  marketing: "page-container",
  wide: "page-container page-container--wide",
  narrow: "page-container page-container--narrow",
}

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  variant?: ContainerVariant
  section?: boolean
  children: ReactNode
}

export function Container({
  as: Tag = "div",
  variant = "marketing",
  section = false,
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={`${variantClass[variant]}${section ? " page-section" : ""} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}
