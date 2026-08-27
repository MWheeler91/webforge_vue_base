import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: ['**/node_modules/**', '**/dist/**', '**/.{git,cache,output,temp}/**', 'e2e/**'],
      root: fileURLToPath(new URL('../', import.meta.url)),
    },
  } as any),
)
