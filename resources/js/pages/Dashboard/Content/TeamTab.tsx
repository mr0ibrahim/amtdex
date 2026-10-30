import { useState } from "react"
import {
  useTeamQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useUploadMediaMutation,
} from "@/lib/queries"

interface TeamMemberData {
  id?: number | string
  name: string
  role: string
  bio?: string
  avatar?: string
  social_links?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  sort_order: number
  is_active: boolean
}

export function TeamTab() {
  const { data: team = [], isLoading } = useTeamQuery()
  const createMutation = useCreateTeamMemberMutation()
  const updateMutation = useUpdateTeamMemberMutation()
  const deleteMutation = useDeleteTeamMemberMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleOpenAdd = () => {
    setFormError(null)
    setEditingMember({
      name: "",
      role: "",
      bio: "",
      avatar: "",
      social_links: { twitter: "", github: "", linkedin: "" },
      sort_order: (team?.length || 0) + 1,
      is_active: true,
    })
  }

  const handleOpenEdit = (m: any) => {
    setFormError(null)
    setEditingMember({
      id: m.id,
      name: m.name || "",
      role: m.role || "",
      bio: m.bio || "",
      avatar: m.avatar || "",
      social_links: m.social_links || { twitter: "", github: "", linkedin: "" },
      sort_order: m.sort_order ?? 1,
      is_active: m.is_active !== false,
    })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingMember) return

    setUploadingAvatar(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingAvatar(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingMember({ ...editingMember, avatar: url })
        }
      },
      onError: (err: any) => {
        setUploadingAvatar(false)
        alert(err?.message || "فشل رفع الصورة")
      },
    })
  }

  const handleSave = () => {
    if (!editingMember) return
    if (!editingMember.name.trim()) {
      setFormError("اسم عضو الفريق مطلوب.")
      return
    }
    if (!editingMember.role.trim()) {
      setFormError("المسمى الوظيفي مطلوب.")
      return
    }

    setFormError(null)

    const payload = {
      name: editingMember.name,
      role: editingMember.role,
      bio: editingMember.bio || null,
      avatar: editingMember.avatar || null,
      social_links: editingMember.social_links || {},
      sort_order: editingMember.sort_order || 1,
      is_active: editingMember.is_active,
    }

    if (editingMember.id) {
      updateMutation.mutate(
        { id: editingMember.id, data: payload },
        {
          onSuccess: () => setEditingMember(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث بيانات العضو."),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setEditingMember(null),
        onError: (err: any) => setFormError(err?.message || "فشل إضافة عضو الفريق."),
      })
    }
  }

  const handleDelete = (m: any) => {
    if (window.confirm(`هل أنت متأكد من حذف عضو الفريق "${m.name}"؟`)) {
      deleteMutation.mutate(m.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف عضو الفريق."),
      })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">فريق العمل والقيادة ({team.length})</h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            إدارة أعضاء الفريق وقيادات الشركة المعروضين في صفحة (من نحن).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors"
        >
          + إضافة عضو جديد
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل أعضاء الفريق...
        </div>
      ) : team.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          لا يوجد أعضاء فريق مضافون حالياً.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.map((m: any) => (
            <div
              key={m.id || m.name}
              className="border border-[var(--color-border)] rounded-xl p-4 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  {m.avatar ? (
                    <img
                      src={m.avatar}
                      alt=""
                      className="size-11 rounded-full object-cover border border-black/10 shrink-0"
                    />
                  ) : (
                    <div className="size-11 rounded-full bg-[var(--color-ink)] text-white font-bold grid place-items-center text-sm shrink-0">
                      {m.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-[14px] text-[var(--color-ink)]">{m.name}</div>
                    <div className="text-[11px] font-semibold text-[var(--color-primary)]">
                      {m.role}
                    </div>
                  </div>
                </div>

                {m.bio && (
                  <p className="mt-2.5 text-[11px] text-[var(--color-text-muted)] line-clamp-2">
                    {m.bio}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[var(--color-border)] pt-3">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editingMember.id ? `تعديل العضو: ${editingMember.name}` : "إضافة عضو فريق جديد"}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
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
                  placeholder="مثال: م. أحمد الغامدي"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  المسمى الوظيفي <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="مثال: المؤسس والمدير التنفيذي"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                نبذة تعريفية مختصرة
              </label>
              <textarea
                placeholder="خبراته ومجال تخصصه وإنجازاته التقنية..."
                value={editingMember.bio || ""}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-16 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Avatar upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[var(--color-ink)]">
                  الصورة الشخصية
                </label>
                <label className="cursor-pointer text-[10px] font-bold text-[var(--color-primary)] hover:underline">
                  {uploadingAvatar ? "جار الرفع..." : "+ رفع صورة"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <input
                placeholder="رابط الصورة الشخصية أو اضغط رفع..."
                value={editingMember.avatar || ""}
                dir="ltr"
                onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Social links */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                روابط التواصل الاجتماعي
              </label>
              <div className="grid sm:grid-cols-3 gap-2">
                <input
                  placeholder="رابط X / Twitter"
                  dir="ltr"
                  value={editingMember.social_links?.twitter || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social_links: { ...editingMember.social_links, twitter: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
                <input
                  placeholder="رابط GitHub"
                  dir="ltr"
                  value={editingMember.social_links?.github || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social_links: { ...editingMember.social_links, github: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
                <input
                  placeholder="رابط LinkedIn"
                  dir="ltr"
                  value={editingMember.social_links?.linkedin || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social_links: { ...editingMember.social_links, linkedin: e.target.value },
                    })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-2.5 py-1.5 text-[11px] font-mono outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={editingMember.sort_order}
                  onChange={(e) => setEditingMember({ ...editingMember, sort_order: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="checkbox"
                    checked={editingMember.is_active}
                    onChange={(e) => setEditingMember({ ...editingMember, is_active: e.target.checked })}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                  />
                  <span className="text-[var(--color-ink)] font-medium">عرض في صفحة من نحن</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
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
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ العضو"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

