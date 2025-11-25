<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description" :links="page.hero.links">
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC :value="page.title" unwrap="p" />
      </template>

      <PromotionalVideo />
    </UPageHero>

    <Motion v-for="(section, index) in page.sections" :key="index"
      :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :transition="{ delay: 0.4 + 0.2 * index }"
      :in-view-options="{ once: true }">
      <UPageSection :title="section.title" :description="section.description" :orientation="section.orientation"
        :reverse="section.reverse" :features="section.features">
        <ImagePlaceholder />
      </UPageSection>
    </Motion>

    <UPageSection :title="page.features.title" :description="page.features.description">
      <UPageGrid>
        <Motion v-for="(item, index) in page.features.items" :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }">
          <UPageCard v-bind="item" spotlight />
        </Motion>
      </UPageGrid>
    </UPageSection>

    <UPageSection id="testimonials" :headline="page.testimonials.headline" :title="page.testimonials.title"
      :description="page.testimonials.description">
      <UPageColumns class="xl:columns-3">
        <Motion v-for="(testimonial, index) in page.testimonials.items" :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }">
          <UPageCard variant="subtle" :description="testimonial.quote"
            class="text-muted flex items-center text-nowrap gap-2"
            :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }">
            <template #footer>
              <UUser v-bind="testimonial.user" size="lg" />
            </template>
          </UPageCard>
        </Motion>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
