<template>
  <main class="not-found-page" aria-labelledby="not-found-title">
    <div class="not-found-page__glow not-found-page__glow--one" aria-hidden="true" />
    <div class="not-found-page__glow not-found-page__glow--two" aria-hidden="true" />

    <section class="not-found-page__content">
      <div class="not-found-page__code" aria-hidden="true">404</div>

      <p class="not-found-page__eyebrow">Page not found</p>
      <h1 id="not-found-title">This page took a wrong turn.</h1>
      <p class="not-found-page__message">
        The address may be incorrect, or the page may have moved. Let’s get you back on track.
      </p>
      <RouterLink class="not-found-page__link" to="/">Return home <span aria-hidden="true">→</span></RouterLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found-page {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4rem 1.5rem;
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  text-align: center;
}

.not-found-page__content { position: relative; max-width: 42rem; }
.not-found-page__code { margin-bottom: 2rem; color: transparent; font-size: clamp(7rem, 23vw, 13rem); font-weight: 800; letter-spacing: .06em; line-height: .85; padding-left: .06em; -webkit-text-stroke: 3px #6366f1; text-shadow: 0 1.25rem 2.5rem rgb(79 70 229 / 12%); }
.not-found-page__eyebrow { margin: 0; color: #4f46e5; font-size: .75rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
.not-found-page h1 { margin: .75rem 0 1rem; color: #0f172a; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 750; letter-spacing: -.045em; line-height: 1.05; }
.not-found-page__message { max-width: 34rem; margin: 0 auto 2rem; color: #475569; font-size: 1.125rem; line-height: 1.7; }
.not-found-page__link { display: inline-flex; align-items: center; gap: .6rem; border-radius: 999px; background: #4f46e5; padding: .8rem 1.25rem; color: #fff; font-size: .95rem; font-weight: 700; text-decoration: none; box-shadow: 0 .75rem 1.5rem rgb(79 70 229 / 25%); transition: transform .16s ease, background .16s ease; }
.not-found-page__link:hover { background: #4338ca; transform: translateY(-2px); }
.not-found-page__link:focus-visible { outline: 3px solid #a5b4fc; outline-offset: 4px; }
.not-found-page__glow { position: absolute; z-index: -1; width: 22rem; height: 22rem; border-radius: 999px; filter: blur(3rem); opacity: .45; }
.not-found-page__glow--one { top: -9rem; left: 12%; background: #c7d2fe; }
.not-found-page__glow--two { right: 8%; bottom: -10rem; background: #bae6fd; }

@media (prefers-reduced-motion: reduce) { .not-found-page__link { transition: none; } }
</style>
