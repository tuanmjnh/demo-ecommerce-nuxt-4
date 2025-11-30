<script setup lang="ts">
// Import type từ Nuxt UI để code gợi ý chuẩn
import type { CommandPaletteGroup, CommandPaletteItem } from '#ui/types'

const router = useRouter()
const menuState = useMenuState()
const isOpen = defineModel<boolean>('modelValue')

// 1. Map Labels
const typeLabels: Record<string, string> = {
  PAGE: 'Trang',
  CATEGORY: 'Danh mục',
  POST: 'Bài viết',
  PRODUCT: 'Sản phẩm',
  LINK: 'Liên kết',
  MODULE: 'Chức năng'
}

// 2. Map Icons
const typeIcons: Record<string, string> = {
  PAGE: 'i-lucide-layout',
  CATEGORY: 'i-lucide-folder',
  POST: 'i-lucide-file-text',
  PRODUCT: 'i-lucide-package',
  LINK: 'i-lucide-link',
  MODULE: 'i-lucide-box'
}

// 3. Logic URL
const resolvePath = (item: Models.IMenu): string => {
  if (!item.url || item.url === '#') return ''
  if (item.type === 'LINK') return item.url
  if (item.url.startsWith('/')) return item.url

  switch (item.type) {
    case 'POST': return `/dich-vu/${item.url}`
    case 'CATEGORY': return `/danh-muc/${item.url}`
    case 'PRODUCT': return `/san-pham/${item.url}`
    default: return `/${item.url}`
  }
}

/**
 * 4. Computed Groups (Đã fix Type)
 * Trả về mảng CommandPaletteGroup[]
 */
const groups = computed<CommandPaletteGroup[]>(() => {
  const items = menuState.flatItems.value || []

  // Helper map item -> CommandPaletteItem
  const mapToCommand = (item: Models.IMenu): CommandPaletteItem => {
    const path = resolvePath(item)

    return {
      id: item._id || item.title, // Bắt buộc có ID
      label: item.title,
      to: path,
      icon: item.icon || typeIcons[item.type] || 'i-lucide-circle',
      suffix: typeLabels[item.type] || item.type,

      // Custom property (cần ép kiểu hoặc dùng slot nếu muốn dùng target)
      // Trong CommandPaletteItem chuẩn, bạn có thể truyền thêm props vào slot
      // Nhưng để đơn giản, ta lưu tạm vào object, lúc onSelect sẽ ép kiểu any để đọc
      target: item.type === 'LINK' && item.url?.startsWith('http') ? '_blank' : undefined
    } as CommandPaletteItem & { target?: string }
  }

  const pages = items.filter(i => ['PAGE', 'LINK', 'MODULE'].includes(i.type))
  const contents = items.filter(i => ['CATEGORY', 'POST'].includes(i.type))
  const products = items.filter(i => i.type === 'PRODUCT')

  return [
    {
      id: 'pages', // ✅ ĐÃ SỬA: Đổi 'key' thành 'id'
      label: 'Trang & Chức năng',
      commands: pages.map(mapToCommand)
    },
    {
      id: 'contents', // ✅ ĐÃ SỬA
      label: 'Nội dung & Dịch vụ',
      commands: contents.map(mapToCommand)
    },
    {
      id: 'products', // ✅ ĐÃ SỬA
      label: 'Sản phẩm',
      commands: products.map(mapToCommand)
    }
  ].filter(g => g.commands.length > 0)
})

const onSelect = (option: any) => {
  if (option.target === '_blank' && option.to) {
    window.open(option.to, '_blank')
    isOpen.value = false
  } else if (option.to) {
    router.push(option.to)
    isOpen.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCommandPalette placeholder="Tìm kiếm nhanh (Ctrl + K)..." :groups="groups" :autoselect="false"
      @update:model-value="onSelect" :fuse="{ resultLimit: 50 }">
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 gap-3 text-gray-500">
          <UIcon name="i-lucide-search-x" class="w-10 h-10 opacity-50" />
          <span class="italic">Không tìm thấy kết quả nào phù hợp.</span>
        </div>
      </template>
    </UCommandPalette>
  </UModal>
</template>