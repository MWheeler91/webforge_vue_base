# WebForge Vue Client Scaffold

A minimal Vue 3 scaffold for creating client websites with the shared WebForge packages.

## Setup

npm install
npm run dev

Copy .env.example to .env.local and set the API values for the client site.

## Validation

npm run type-check
npm run build
npm run test:unit

## Shared packages

- @mwheeler91/ui: shared Vue components, styles, and UI configuration
- @mwheeler91/site-core: API client, API helpers, types, logging, and utilities

Client-specific branding, routes, page templates, content, and demos belong in the client repository.

## Cloudflare Pages

Use the repository root as the project root, npm run build as the build command, and dist as the output directory. Set the VITE_* values in the Cloudflare Pages environment settings.

The project requires Node.js 24.11 or newer.
