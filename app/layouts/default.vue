<template>
  <div
    class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body">
    <AppHeader />

    <UMain class="grow">
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>
