<template>
  <div
    class="w-full max-w-md rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] p-6 shadow-sm"
  >
    <div class="flex items-center gap-3">
      <svg
        class="h-5 w-5 animate-spin text-[color:var(--brand)]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>

      <div>
        <div class="font-semibold text-[color:var(--text-primary)]">Loading site…</div>
        <div class="text-sm text-[color:var(--text-secondary)]">
          Applying theme and site settings.
        </div>
      </div>
    </div>

    <div class="mt-5 space-y-3">
      <div class="h-3 w-3/4 rounded bg-[color:var(--border-default)]/40"></div>
      <div class="h-3 w-full rounded bg-[color:var(--border-default)]/30"></div>
      <div class="h-3 w-5/6 rounded bg-[color:var(--border-default)]/30"></div>
    </div>
  </div>
</template>