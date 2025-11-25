<script setup lang="ts">
const props = defineProps<{
  data: {
    title: string;
    price?: number;
    priceSale?: number;
    sku?: string; // Mã sản phẩm
    description: string; // HTML mô tả
    specifications?: Record<string, string>; // Thông số kỹ thuật
    images: string[]; // Mảng ảnh gallery
    status?: 'IN_STOCK' | 'OUT_OF_STOCK';
  }
}>()

// Helper format tiền tệ VND
const formatPrice = (value?: number) => {
  if (!value) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const currentImage = ref(props.data.images?.[0] || 'https://placehold.co/600x600?text=No+Image')
</script>

<template>
  <div class="product-detail py-10">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

        <div class="space-y-4">
          <div class="aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50">
            <img :src="currentImage" class="w-full h-full object-contain" :alt="data.title" />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2" v-if="data.images && data.images.length > 1">
            <button v-for="(img, idx) in data.images" :key="idx" @click="currentImage = img"
              class="w-20 h-20 rounded border-2 shrink-0 overflow-hidden"
              :class="currentImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'">
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div>
          <div class="mb-2">
            <UBadge v-if="data.status === 'IN_STOCK'" color="green" variant="subtle" label="Còn hàng" />
            <UBadge v-else-if="data.status === 'OUT_OF_STOCK'" color="red" variant="subtle" label="Hết hàng" />
          </div>

          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ data.title }}</h1>

          <div class="text-sm text-gray-500 mb-6">Mã SP: <span class="font-mono text-gray-900 dark:text-gray-300">{{
            data.sku || 'N/A' }}</span></div>

          <div class="flex items-end gap-3 mb-8">
            <span class="text-3xl font-bold text-primary">{{ formatPrice(data.priceSale || data.price) }}</span>
            <span v-if="data.priceSale" class="text-xl text-gray-400 line-through mb-1">{{ formatPrice(data.price)
            }}</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 border-t border-b border-gray-100 dark:border-gray-800 py-6 mb-6">
            <UButton size="xl" block icon="i-lucide-shopping-cart" label="Đặt hàng ngay" />
            <UButton size="xl" block variant="outline" icon="i-lucide-phone" label="Tư vấn: 0987.654.321" />
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm space-y-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-check-circle-2" class="text-green-500" />
              <span>Bảo hành chính hãng 12 tháng</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-truck" class="text-blue-500" />
              <span>Miễn phí vận chuyển nội thành</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">Chi tiết sản phẩm</h2>
            <div class="prose dark:prose-invert max-w-none" v-html="data.description"></div>
          </div>

          <div v-if="data.specifications">
            <h3 class="font-bold text-lg mb-4">Thông số kỹ thuật</h3>
            <table class="w-full text-sm text-left">
              <tbody>
                <tr v-for="(val, key) in data.specifications" :key="key"
                  class="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td class="py-3 text-gray-500 w-1/3">{{ key }}</td>
                  <td class="py-3 font-medium">{{ val }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </UContainer>
  </div>
</template>
