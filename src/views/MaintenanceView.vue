<template>
  <main
    class="maintenance-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
    role="status"
    aria-live="polite"
  >
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute left-1/2 top-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div class="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
    </div>

    <div class="relative flex flex-col items-center">
      <div class="relative mb-8 flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-white shadow-xl shadow-gray-400/20 ring-1 ring-gray-300">
        <div class="absolute -inset-3 rounded-[2.75rem] border border-dashed border-indigo-300/70" aria-hidden="true" />
        <svg viewBox="0 0 128 128" class="h-28 w-28 text-indigo-700" fill="none" role="img" aria-label="Maintenance gears">
          <path d="M49 18h15l2 9a30 30 0 0 1 7 4l8-4 8 13-7 6a29 29 0 0 1 0 8l7 6-8 13-8-4a30 30 0 0 1-7 4l-2 9H49l-2-9a30 30 0 0 1-7-4l-8 4-8-13 7-6a29 29 0 0 1 0-8l-7-6 8-13 8 4a30 30 0 0 1 7-4l2-9Z" fill="currentColor" opacity=".16" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />
          <circle cx="56.5" cy="50" r="13" fill="white" stroke="currentColor" stroke-width="4" />
          <circle cx="56.5" cy="50" r="4" fill="currentColor" />
          <path d="M84 54h11l1.5 6a20 20 0 0 1 4 2l5-2 6 9-4.5 4a19 19 0 0 1 0 5l4.5 4-6 9-5-2a20 20 0 0 1-4 2l-1.5 6H84l-1.5-6a20 20 0 0 1-4-2l-5 2-6-9 4.5-4a19 19 0 0 1 0-5l-4.5-4 6-9 5 2a20 20 0 0 1 4-2l1.5-6Z" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />
          <circle cx="89.5" cy="75.5" r="9" fill="white" stroke="currentColor" stroke-width="3" />
          <circle cx="89.5" cy="75.5" r="3" fill="currentColor" />
        </svg>
        <span class="absolute right-2 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-sm text-white shadow-lg shadow-indigo-700/30" aria-hidden="true">⚙</span>
      </div>

      <p class="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">We’ll be back soon</p>
      <h1 class="mb-5 max-w-4xl text-4xl font-bold tracking-tight text-gray-800 md:text-5xl lg:text-6xl">Site is under maintenance</h1>
      <p class="mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl lg:text-2xl">{{ props.message || defaultMessage }}</p>

      <div class="mt-6 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-700 shadow-sm">
        <span class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" aria-hidden="true" />
        Updates are in progress
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: string
  }>(),
  { message: '' },
)

const defaultMessage = 'We’re working hard to improve your experience. Please check back shortly.'
</script>

<style scoped>
.maintenance-page {
  isolation: isolate;
  background: #f3f4f6 !important;
  color: #374151 !important;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
}

.maintenance-page h1 {
  color: #1f2937 !important;
  font-family: inherit !important;
}

.maintenance-page p {
  font-family: inherit !important;
}

@media (prefers-color-scheme: dark) {
  .maintenance-page {
    background: #f3f4f6 !important;
    color: #374151 !important;
  }

  .maintenance-page h1 {
    color: #1f2937 !important;
  }
}
</style>
