/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Tailwind resolves content globs from the project working directory.
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/assets/master-theme.css',
  ],
  theme: {
    extend: {
      maxWidth: {
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}
