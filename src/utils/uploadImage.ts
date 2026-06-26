export interface UploadOptions {
  folder?: string
  resourceType?: 'image' | 'raw' | 'auto'
}

export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {},
): Promise<{ url: string; publicId: string; resourceType: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  const resourceType = options.resourceType || (isPdf ? 'raw' : 'image')

  if (options.folder) {
    formData.append('folder', options.folder)
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData },
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    resourceType,
  }
}

/** Upload to portfolio/projects/{projectId}/images or .../documents */
export const uploadProjectAsset = async (
  file: File,
  projectId: string,
  kind: 'images' | 'documents',
) => {
  const folder = `portfolio/projects/${projectId}/${kind}`
  return uploadToCloudinary(file, { folder })
}
