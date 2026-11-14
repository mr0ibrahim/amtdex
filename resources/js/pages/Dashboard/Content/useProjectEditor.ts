import { useMemo, useRef, useState, type ChangeEvent } from "react"
import { useUpsertProjectMutation, useUploadMediaMutation } from "@/lib/queries"
import { errorMessage } from "@/lib/errors"
import type { Project, ProjectDraft } from "@/types/project"

type ImageField = "cover_image" | "gallery" | "og_image"

export function useProjectEditor(projects: Project[]) {
  const upsertProjectMutation = useUpsertProjectMutation()
  const uploadMutation = useUploadMediaMutation()
  const [editingProject, setEditingProject] = useState<ProjectDraft | null>(null)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [uploads, setUploads] = useState<Partial<Record<ImageField, boolean>>>({})
  const [galleryUrlInput, setGalleryUrlInput] = useState("")
  const [customCat, setCustomCat] = useState(false)
  const version = useRef(0)
  const existingCategories = useMemo(() => Array.from(new Set(projects.map(p => p.cat.trim()).filter(Boolean))), [projects])

  const openProject = (project: Project) => {
    version.current++
    setProjectError(null)
    setCustomCat(false)
    setGalleryUrlInput("")
    setUploads({})
    setEditingProject({ ...project, originalSlug: project.id ? project.slug : undefined })
  }
  const closeProject = () => { version.current++; setEditingProject(null) }

  const handleSaveProject = () => {
    if (!editingProject) return
    const required = [[editingProject.title, "عنوان المشروع"], [editingProject.client, "اسم العميل"],
      [editingProject.cat, "تصنيف المشروع"], [editingProject.summary, "ملخص المشروع"]]
    const missing = required.find(([value]) => !value.trim())
    if (missing) { setProjectError(`${missing[1]} مطلوب.`); return }
    setProjectError(null)
    const currentVersion = version.current
    upsertProjectMutation.mutate(editingProject, {
      onSuccess: () => { if (currentVersion === version.current) closeProject() },
      onError: error => { if (currentVersion === version.current) setProjectError(errorMessage(error, "حدث خطأ أثناء حفظ المشروع.")) },
    })
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, field: ImageField) => {
    const file = event.target.files?.[0]
    if (!file || !editingProject || uploads[field]) return
    const currentVersion = version.current
    setUploads(current => ({ ...current, [field]: true }))
    try {
      const result = await uploadMutation.mutateAsync(file)
      if (version.current !== currentVersion) return
      setEditingProject(current => current ? {
        ...current, [field]: field === "gallery" ? [...(current.gallery ?? []), result.url] : result.url,
      } : current)
    } catch (error) {
      if (version.current === currentVersion) setProjectError(errorMessage(error, "فشل رفع الصورة"))
    } finally {
      if (version.current === currentVersion) setUploads(current => ({ ...current, [field]: false }))
    }
  }

  const handleAddGalleryUrl = () => {
    const url = galleryUrlInput.trim()
    if (!url) return
    setEditingProject(current => current ? { ...current, gallery: [...(current.gallery ?? []), url] } : current)
    setGalleryUrlInput("")
  }
  const handleRemoveGalleryItem = (index: number) => setEditingProject(current => current ? {
    ...current, gallery: (current.gallery ?? []).filter((_, i) => i !== index),
  } : current)

  return {
    editingProject, setEditingProject, openProject, closeProject, projectError, existingCategories,
    customCat, setCustomCat, galleryUrlInput, setGalleryUrlInput, handleSaveProject,
    uploadingCover: !!uploads.cover_image, uploadingGallery: !!uploads.gallery, uploadingOg: !!uploads.og_image,
    handleCoverUpload: (event: ChangeEvent<HTMLInputElement>) => uploadImage(event, "cover_image"),
    handleGalleryUpload: (event: ChangeEvent<HTMLInputElement>) => uploadImage(event, "gallery"),
    handleOgUpload: (event: ChangeEvent<HTMLInputElement>) => uploadImage(event, "og_image"),
    handleAddGalleryUrl, handleRemoveGalleryItem, saving: upsertProjectMutation.isPending,
  }
}

export type ProjectEditorState = ReturnType<typeof useProjectEditor>
