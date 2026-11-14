export type Role = "admin" | "editor" | "author" | "viewer"
export type User = { id: string; name: string; email: string; role: Role }
export type Session = { user: User; token?: string }
