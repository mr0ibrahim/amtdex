import { useState } from "react"
import {
  useClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useUploadMediaMutation,
} from "@/lib/queries"

interface ClientData {
  id?: number | string
  name: string
  logo: string
  url?: string
  sort_order: number
  is_active: boolean
}

export function ClientsTab() {
  const { data: clients = [], isLoading } = useClientsQuery()
  const createMutation = useCreateClientMutation()
  const updateMutation = useUpdateClientMutation()
  const deleteMutation = useDeleteClientMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editingClient, setEditingClient] = useState<ClientData | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const handleOpenAdd = () => {
    setFormError(null)
    setEditingClient({
      name: "",
      logo: "",
      url: "",
      sort_order: (clients?.length || 0) + 1,
      is_active: true,
    })
  }

  const handleOpenEdit = (c: any) => {
    setFormError(null)
    setEditingClient({
      id: c.id,
      name: c.name || (typeof c === "string" ? c : ""),
      logo: c.logo || c.logo_url || (typeof c === "string" ? c : ""),
      url: c.url || c.website || "",
      sort_order: c.sort_order ?? 1,
      is_active: c.is_active !== false,
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingClient) return

    setUploadingLogo(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingLogo(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingClient({ ...editingClient, logo: url })
        }
      },
      onError: (err: any) => {
        setUploadingLogo(false)
        alert(err?.message || "فشل رفع الشعار")
      },
    })
  }

  const handleSave = () => {
    if (!editingClient) return
    if (!editingClient.name.trim()) {
      setFormError("اسم الشريك / العميل مطلوب.")
      return
    }
    if (!editingClient.logo.trim()) {
      setFormError("شعار الشريك (رابط أو صورة) مطلوب.")
      return
    }

    setFormError(null)

    const payload = {
      name: editingClient.name,
      logo: editingClient.logo,
      url: editingClient.url || null,
      sort_order: editingClient.sort_order || 1,
      is_active: editingClient.is_active,
    }

    if (editingClient.id) {
      updateMutation.mutate(
        { id: editingClient.id, data: payload },
        {
          onSuccess: () => setEditingClient(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث بيانات الشريك."),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setEditingClient(null),
        onError: (err: any) => setFormError(err?.message || "فشل إضافة الشريك."),
      })
    }
  }

  const handleDelete = (c: any) => {
    const name = typeof c === "string" ? c : c.name
    if (window.confirm(`هل أنت متأكد من حذف الشريك "${name}"؟`)) {
      deleteMutation.mutate(c.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف الشريك."),
      })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">الشركاء والعملاء ({clients.length})</h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            إدارة شعارات الشركاء وعملاء النجاح في شريط الثقة بالصفحة الرئيسية.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors"
        >
          + إضافة شريك / عميل
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل الشركاء...
        </div>
      ) : clients.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          لا يوجد شركاء مضافون حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {clients.map((c: any, idx: number) => {
            const name = typeof c === "string" ? c : c.name
            const logo = typeof c === "object" ? c.logo : null
            return (
              <div
                key={typeof c === "string" ? c : (c.id || idx)}
                className="border border-[var(--color-border)] rounded-xl p-3 bg-white flex flex-col justify-between items-center text-center gap-2 hover:border-[var(--color-primary)]/40 transition-colors"
              >
                <div className="h-12 w-full flex items-center justify-center p-1">
                  {logo ? (
                    <img src={logo} alt={name} className="max-h-10 max-w-full object-contain" />
                  ) : (
                    <span className="text-[14px] font-extrabold text-[var(--color-ink)]">{name}</span>
                  )}
                </div>

                <div className="w-full border-t border-[var(--color-border)] pt-2 flex items-center justify-between text-[11px]">
                  <span className="truncate max-w-[80px] text-[var(--color-text-muted)]">{name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="text-[10px] text-[var(--color-primary)] font-bold hover:underline"
                    >
                      تعديل
                    </button>
                    {typeof c === "object" && c.id && (
                      <button
                        onClick={() => handleDelete(c)}
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[460px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editingClient.id ? `تعديل: ${editingClient.name}` : "إضافة شريك أو عميل جديد"}
              </h3>
              <button
                onClick={() => setEditingClient(null)}
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

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                اسم الشريك / العميل <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="مثال: نون، أرامكو، STC..."
                value={editingClient.name}
                onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Logo upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[var(--color-ink)]">
                  شعار الشريك (رابط صورة أو نص) <span className="text-red-500">*</span>
                </label>
                <label className="cursor-pointer text-[10px] font-bold text-[var(--color-primary)] hover:underline">
                  {uploadingLogo ? "جار الرفع..." : "+ رفع شعار"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml,image/webp"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
              <input
                placeholder="https://... أو اسم الشريك كنص"
                value={editingClient.logo}
                dir="ltr"
                onChange={(e) => setEditingClient({ ...editingClient, logo: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono outline-none focus:border-[var(--color-primary)]"
              />
              {editingClient.logo && editingClient.logo.startsWith("http") && (
                <div className="mt-2 p-2 bg-[var(--color-card-soft)] rounded-lg flex items-center justify-center">
                  <img src={editingClient.logo} alt="معاينة" className="h-8 max-w-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                رابط موقع الشريك (اختياري)
              </label>
              <input
                placeholder="https://partner-website.com"
                value={editingClient.url || ""}
                dir="ltr"
                onChange={(e) => setEditingClient({ ...editingClient, url: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={editingClient.sort_order}
                  onChange={(e) => setEditingClient({ ...editingClient, sort_order: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="checkbox"
                    checked={editingClient.is_active}
                    onChange={(e) => setEditingClient({ ...editingClient, is_active: e.target.checked })}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                  />
                  <span className="text-[var(--color-ink)] font-medium">عرض في الموقع الرئيسي</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
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
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ الشريك"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
