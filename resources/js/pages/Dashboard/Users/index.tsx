import { useState } from "react"
import { getSession } from "@/lib/auth"
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadMediaMutation,
  type DashboardUser,
} from "@/lib/queries"

const ROLES: Array<{ id: "admin" | "editor" | "author" | "viewer"; label: string; desc: string }> = [
  { id: "admin", label: "مدير النظام (Admin)", desc: "صلاحيات كاملة لكل أجزاء النظام والإعدادات" },
  { id: "editor", label: "محرر (Editor)", desc: "إدارة المحتوى والمشاريع والخدمات والوسائط" },
  { id: "author", label: "كاتب مدونة (Author)", desc: "كتابة ونشر المقالات في المدونة التقنية" },
  { id: "viewer", label: "مشاهد (Viewer)", desc: "صلاحية قراءة وعرض فقط" },
]

export function UsersPage() {
  const me = getSession()?.user
  const { data: users = [], isLoading, error, refetch } = useUsersQuery()
  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()
  const deleteMutation = useDeleteUserMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editingUser, setEditingUser] = useState<Partial<DashboardUser> & { password?: string } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingUser) return

    setUploadingAvatar(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingAvatar(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingUser({ ...editingUser, avatar: url })
        }
      },
      onError: (err: any) => {
        setUploadingAvatar(false)
        alert(err?.message || "فشل رفع الصورة")
      },
    })
  }

  const handleSave = () => {
    if (!editingUser) return
    setFormError(null)

    if (!editingUser.name?.trim()) {
      setFormError("اسم المستخدم مطلوب.")
      return
    }
    if (!editingUser.email?.trim()) {
      setFormError("البريد الإلكتروني مطلوب.")
      return
    }

    if (!editingUser.id) {
      // Create new
      if (!editingUser.password || editingUser.password.length < 6) {
        setFormError("كلمة المرور مطلوبة وتتكون من 6 خانات على الأقل.")
        return
      }

      createMutation.mutate(
        {
          name: editingUser.name,
          email: editingUser.email,
          password: editingUser.password,
          role: editingUser.role || "viewer",
          avatar: editingUser.avatar || undefined,
          bio: editingUser.bio || undefined,
          social_links: editingUser.social_links || undefined,
        },
        {
          onSuccess: () => setEditingUser(null),
          onError: (err: any) => setFormError(err?.message || "فشل إضافة المستخدم."),
        }
      )
    } else {
      // Update existing
      updateMutation.mutate(
        {
          id: editingUser.id,
          data: {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            password: editingUser.password ? editingUser.password : undefined,
            avatar: editingUser.avatar || undefined,
            bio: editingUser.bio || undefined,
            social_links: editingUser.social_links || undefined,
          },
        },
        {
          onSuccess: () => setEditingUser(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث بيانات المستخدم."),
        }
      )
    }
  }

  const handleDelete = (u: DashboardUser) => {
    if (me?.email === u.email) {
      alert("لا يمكنك حذف حسابك الحالي المسجل به الدخول!")
      return
    }
    if (window.confirm(`هل أنت متأكد من حذف المستخدم "${u.name}" (${u.email})؟`)) {
      deleteMutation.mutate(u.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف المستخدم."),
      })
    }
  }

  const roleBadge = (role?: string) => (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
        role === "admin"
          ? "bg-[var(--color-ink)] text-white"
          : role === "editor"
            ? "bg-[var(--color-lavender)] text-[var(--color-primary)]"
            : role === "author"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
      }`}
    >
      {role === "admin"
        ? "مدير (Admin)"
        : role === "editor"
          ? "محرر (Editor)"
          : role === "author"
            ? "كاتب (Author)"
            : "مشاهد (Viewer)"}
    </span>
  )

  const openEdit = (u?: DashboardUser) => {
    setFormError(null)
    if (u) {
      setEditingUser({
        ...u,
        password: "",
        social_links: u.social_links || { twitter: "", github: "", linkedin: "" },
      })
      return
    }
    setEditingUser({
      name: "",
      email: "",
      password: "",
      role: "editor",
      avatar: "",
      bio: "",
      social_links: { twitter: "", github: "", linkedin: "" },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-[18px] font-extrabold text-[var(--color-ink)]">إدارة المستخدمين والصلاحيات</h1>
          <span className="text-[11px] text-[var(--color-text-faint)] block mt-1">
            مسجل الدخول حالياً كـ: <strong className="text-[var(--color-ink)]">{me?.email ?? "-"}</strong>
          </span>
        </div>
        <button
          onClick={() => openEdit()}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-4 py-2.5 rounded-xl hover:bg-black transition-colors w-full sm:w-auto"
        >
          + إضافة مستخدم جديد
        </button>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل قائمة المستخدمين...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-[12px] text-red-600">
            تعذر تحميل المستخدمين.
            <button onClick={() => refetch()} className="mr-2 underline font-bold">
              إعادة المحاولة
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">لا يوجد مستخدمون حالياً.</div>
        ) : (
          <>
            <div className="dash-mobile-cards p-3">
              {users.map((u) => (
                <article key={u.id || u.email} className="dash-post-card">
                  <div className="flex items-start gap-3">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt=""
                        className="size-10 rounded-full object-cover border border-black/10 shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-[var(--color-ink)] text-white font-bold grid place-items-center text-[13px] shrink-0">
                        {u.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[13px] text-[var(--color-ink)]">{u.name}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)] font-mono break-all mt-0.5" dir="ltr">
                        {u.email}
                      </div>
                      {u.bio && (
                        <p className="text-[10px] text-[var(--color-text-faint)] mt-1 line-clamp-2">{u.bio}</p>
                      )}
                    </div>
                    {roleBadge(u.role)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(u)}
                      className="rounded-xl border border-[var(--color-border)] py-2 text-[11px] font-bold text-[var(--color-ink)]"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      className="rounded-xl border border-rose-200 text-rose-600 py-2 text-[11px] font-bold"
                    >
                      حذف
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="dash-desktop-table overflow-x-auto">
              <table className="w-full text-[12px] min-w-[640px]">
                <thead className="bg-[var(--color-card-soft)] text-[11px] text-[var(--color-text-faint)]">
                  <tr>
                    <th className="text-right px-4 py-3">المستخدم</th>
                    <th className="text-right px-4 py-3">البريد الإلكتروني</th>
                    <th className="text-right px-4 py-3">الدور والصلاحية</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id || u.email} className="border-t border-[var(--color-border)] hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt=""
                              className="size-9 rounded-full object-cover border border-black/10 shrink-0"
                            />
                          ) : (
                            <div className="size-9 rounded-full bg-[var(--color-ink)] text-white font-bold grid place-items-center text-[13px] shrink-0">
                              {u.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[var(--color-ink)]">{u.name}</div>
                            {u.bio && (
                              <div className="text-[10px] text-[var(--color-text-muted)] line-clamp-1 max-w-[240px]">
                                {u.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[var(--color-text-muted)]" dir="ltr">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">{roleBadge(u.role)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1.5 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* User Form Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-[540px] w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-0 sm:my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[var(--color-ink)] leading-snug">
                {editingUser.id ? `تعديل المستخدم: ${editingUser.name}` : "إضافة مستخدم جديد للنظام"}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
                {formError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="مثال: أحمد الغامدي"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  dir="ltr"
                  placeholder="name@amtdex.com"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الدور والصلاحية <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUser.role || "viewer"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  {editingUser.id ? "كلمة المرور (اتركها فارغة للإبقاء)" : "كلمة المرور (6 خانات+)"}
                </label>
                <input
                  type="password"
                  dir="ltr"
                  placeholder={editingUser.id ? "••••••••" : "أدخل كلمة المرور"}
                  value={editingUser.password || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                الصورة الشخصية (Avatar)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  placeholder="رابط الصورة أو اضغط رفع..."
                  value={editingUser.avatar || ""}
                  dir="ltr"
                  onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                  className="flex-1 border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
                <label className="shrink-0 inline-flex items-center justify-center bg-[var(--color-lavender)] text-[var(--color-primary)] text-[11px] font-bold px-3 py-2 rounded-xl cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  {uploadingAvatar ? "جار الرفع..." : "رفع صورة 📤"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              {editingUser.avatar && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)]">
                  <img
                    src={editingUser.avatar}
                    alt="معاينة الصورة"
                    className="size-10 rounded-full object-cover border border-black/10"
                  />
                  <span className="text-[11px] text-[var(--color-text-muted)] truncate flex-1">
                    معاينة الصورة الشخصية
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingUser({ ...editingUser, avatar: "" })}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    إزالة
                  </button>
                </div>
              )}
            </div>

            {/* Author Profile section */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                نبذة الكاتب (تظهر تحت المقالات في المدونة)
              </label>
              <textarea
                placeholder="نبذة مختصرة عن الكاتب وتخصصه..."
                value={editingUser.bio || ""}
                onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-18 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                روابط التواصل الاجتماعي
              </label>
              <div className="grid sm:grid-cols-3 gap-2">
                <input
                  placeholder="رابط X / Twitter"
                  dir="ltr"
                  value={editingUser.social_links?.twitter || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      social_links: { ...editingUser.social_links, twitter: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
                <input
                  placeholder="رابط GitHub"
                  dir="ltr"
                  value={editingUser.social_links?.github || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      social_links: { ...editingUser.social_links, github: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
                <input
                  placeholder="رابط LinkedIn"
                  dir="ltr"
                  value={editingUser.social_links?.linkedin || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      social_links: { ...editingUser.social_links, linkedin: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={createMutation.isPending || updateMutation.isPending}
                onClick={handleSave}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ المستخدم"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
