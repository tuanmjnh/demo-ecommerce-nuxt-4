export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    const query = getQuery(event)
    const { cloudinary } = useCloudinary()
    const folderName = String(query.folder || '')

    // 1. Root Folders
    if (!folderName || folderName.toLowerCase() === 'root') {
      const rootFolders = await cloudinary.api.root_folders()
      return {
        parent: null,
        folders: [{
          name: 'Root',
          path: 'Root',
          hasChildren: true,
          external_id: null,
          children: rootFolders.folders.map((f: any) => ({ ...f, hasChildren: true }))
        }]
      }
    }

    // 2. Sub-folders
    const subfolders = await cloudinary.api.sub_folders(folderName)
    return {
      parent: folderName,
      folders: subfolders.folders.map((f: any) => ({ ...f, hasChildren: true }))
    }

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
