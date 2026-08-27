<template>
  <main class="page-fallback" role="alert" aria-labelledby="page-fallback-title">
    <div class="page-fallback__glow page-fallback__glow--top" aria-hidden="true" />
    <div class="page-fallback__glow page-fallback__glow--bottom" aria-hidden="true" />

    <section class="page-fallback__card">
      <div class="page-fallback__icon" aria-hidden="true">
        <svg viewBox="0 0 96 96" fill="none">
          <path d="M48 12a30 30 0 0 0-29.5 24.5A20 20 0 0 0 24 76h48a20 20 0 0 0 5.5-39.5A30 30 0 0 0 48 12Z" fill="currentColor" opacity=".14" />
          <path d="M48 12a30 30 0 0 0-29.5 24.5A20 20 0 0 0 24 76h48a20 20 0 0 0 5.5-39.5A30 30 0 0 0 48 12Z" stroke="currentColor" stroke-width="3" />
          <path d="m34 42 28 18M62 42 34 60" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
        </svg>
      </div>

      <p class="page-fallback__eyebrow">A brief pause</p>
      <h1 id="page-fallback-title">{{ title }}</h1>
      <p class="page-fallback__message">{{ message }}</p>

      <div class="page-fallback__actions">
        <button v-if="onRetry" type="button" class="page-fallback__button page-fallback__button--primary" @click="handleRetry">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 10a6 6 0 1 1-1.76-4.24M16 4v4h-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Try again
        </button>

        <a v-if="homeHref" :href="homeHref" class="page-fallback__button page-fallback__button--secondary">
          Return home
        </a>
      </div>

      <p v-if="showTips" class="page-fallback__hint">Please try again in a moment.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    showTips?: boolean
    homeHref?: string | null
    onRetry?: (() => void) | null
  }>(),
  {
    title: 'We’re having a little trouble',
    message: 'This page is taking a moment to get ready. We’ll have you back on track soon.',
    showTips: true,
    homeHref: '/',
    onRetry: null,
  },
)

function handleRetry() {
  props.onRetry?.()
}
</script>

<style scoped>
.page-fallback {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  padding: 3rem 1.25rem;
  background: var(--bg_canvas, #f5f7f9);
  color: var(--text_primary, #17212b);
}

.page-fallback__glow {
  position: absolute;
  z-index: -1;
  width: 24rem;
  height: 24rem;
  border-radius: 999px;
  filter: blur(4rem);
  opacity: .45;
}

.page-fallback__glow--top { top: -12rem; right: -5rem; background: color-mix(in srgb, var(--brand, #4f46e5) 24%, transparent); }
.page-fallback__glow--bottom { bottom: -14rem; left: -8rem; background: color-mix(in srgb, var(--info, #38bdf8) 20%, transparent); }

.page-fallback__card {
  width: min(100%, 38rem);
  padding: clamp(2rem, 6vw, 4rem);
  border: 1px solid color-mix(in srgb, var(--border_default, #d8e0e8) 82%, transparent);
  border-radius: 2rem;
  background: color-mix(in srgb, var(--bg_elevated, #fff) 88%, transparent);
  box-shadow: 0 2rem 5rem rgb(25 42 61 / 12%);
  text-align: center;
  backdrop-filter: blur(1rem);
}

.page-fallback__icon {
  display: grid;
  width: 5.5rem;
  height: 5.5rem;
  margin: 0 auto 1.75rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--brand, #4f46e5) 20%, transparent);
  border-radius: 1.5rem;
  color: var(--brand, #4f46e5);
  background: color-mix(in srgb, var(--brand, #4f46e5) 8%, var(--bg_elevated, #fff));
}

.page-fallback__icon svg { width: 3.75rem; height: 3.75rem; }
.page-fallback__eyebrow { margin: 0 0 .75rem; color: var(--brand, #4f46e5); font-size: .72rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
.page-fallback h1 { margin: 0; color: var(--text_primary, #17212b); font-size: clamp(1.8rem, 5vw, 2.6rem); line-height: 1.1; letter-spacing: -.035em; }
.page-fallback__message { max-width: 27rem; margin: 1rem auto 0; color: var(--text_secondary, #617080); font-size: 1rem; line-height: 1.7; }

.page-fallback__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 2rem; }
.page-fallback__button { display: inline-flex; min-height: 2.9rem; align-items: center; justify-content: center; gap: .5rem; padding: .75rem 1.15rem; border-radius: .8rem; font-size: .9rem; font-weight: 700; text-decoration: none; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.page-fallback__button:hover { transform: translateY(-2px); }
.page-fallback__button:focus-visible { outline: 3px solid color-mix(in srgb, var(--brand, #4f46e5) 35%, transparent); outline-offset: 3px; }
.page-fallback__button svg { width: 1.1rem; height: 1.1rem; }
.page-fallback__button--primary { border: 1px solid var(--brand, #4f46e5); color: var(--text_on_brand, #fff); background: var(--brand, #4f46e5); box-shadow: 0 .5rem 1rem color-mix(in srgb, var(--brand, #4f46e5) 22%, transparent); }
.page-fallback__button--secondary { border: 1px solid var(--border_default, #d8e0e8); color: var(--text_primary, #17212b); background: var(--bg_surface, #fff); }
.page-fallback__hint { margin: 1.5rem 0 0; color: var(--text_secondary, #617080); font-size: .8rem; }
</style>
