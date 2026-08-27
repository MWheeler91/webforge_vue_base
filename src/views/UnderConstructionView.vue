<template>
  <main
    class="under-construction flex min-h-screen flex-col items-center justify-center bg-[#111827] px-6 text-center !text-white"
    aria-labelledby="under-construction-title"
  >
    <div class="construction-sign mb-6" aria-hidden="true">🚧</div>

    <h1 id="under-construction-title" class="construction-title mb-4 text-4xl font-extrabold tracking-wide !text-[#facc15] sm:text-5xl">
      Site Under Construction
    </h1>

    <p class="construction-copy mb-6 max-w-xl text-lg leading-relaxed !text-[#d1d5db] sm:text-xl">
      We’re putting the finishing touches in place. This site will be live soon — please check back shortly.
    </p>

    <div class="construction-tags flex flex-wrap justify-center gap-3 text-sm !text-[#9ca3af]" aria-label="Site status">
      <span class="construction-tag rounded-full bg-[#1f2937] px-3 py-1">#ComingSoon</span>
      <span class="construction-tag rounded-full bg-[#1f2937] px-3 py-1">#InProgress</span>
      <span class="construction-tag rounded-full bg-[#1f2937] px-3 py-1">#CheckBackSoon</span>
    </div>
  </main>
</template>

<style scoped>
.under-construction {
  isolation: isolate;
  min-height: 100vh !important;
  background: #111827 !important;
  color: #ffffff !important;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

 .construction-sign {
  display: block !important;
  color: #ffffff !important;
  font-family: sans-serif !important;
  font-size: 10rem !important;
  line-height: 1 !important;
  animation: construction-bounce 1s infinite !important;
}

.construction-title {
  color: #facc15 !important;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif !important;
  font-size: clamp(2.25rem, 5vw, 3rem) !important;
  line-height: 1.15 !important;
}

.construction-copy {
  color: #d1d5db !important;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif !important;
}

.construction-tags,
.construction-tag {
  color: #9ca3af !important;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif !important;
}

.construction-tag {
  background: #1f2937 !important;
}

@keyframes construction-bounce {
  0%,
  100% {
    transform: translateY(-12%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .construction-sign {
    animation: none;
  }
}
</style>
