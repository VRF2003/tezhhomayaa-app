# Deployment Guide

## Vision

The Tezhhomayaa deployment strategy focuses on extreme performance, global edge delivery, and developer velocity. Built on the Next.js App Router, the project utilizes Vercel for zero-config global deployments, ensuring the storefront loads instantly worldwide via the Vercel Edge Network.

## Deployment Philosophy

- **Zero-Downtime Releases**: Commits to the `main` branch automatically build and swap out the production environment.
- **Preview Environments**: Every Pull Request generates a unique URL to test VXP changes before merging.
- **Edge First**: Static assets and HTML are cached globally.

==================================================

## Development Environment

To run the project locally:

- **Node Version**: Node.js `v20.x` (Recommended)
- **Package Manager**: `npm`

| Command | Purpose |
| :--- | :--- |
| `npm install` | Installs all dependencies including Next.js, Framer Motion, and Tailwind CSS. |
| `npm run dev` | Boots the Next.js development server at `localhost:3000` with Fast Refresh. |
| `npm run build` | Compiles the application, executing Next.js SSG and bundling assets. |
| `npm run start` | Boots the compiled production server locally for final testing. |
| `npm run lint` | Runs the Next.js ESLint configuration. |

==================================================

## Folder Structure

### Production Folders
These folders are critical for the build process:
- `/app` - The Next.js App Router architecture.
- `/lib` - Contains all `.json` files acting as the static database.
- `/public` - Contains fonts (`Devasia.woff2`) and static vectors.

### Ignored Folders (`.gitignore`)
- `/.next` - Next.js build cache.
- `/node_modules` - Dependency binaries.
- `.env.local` - Local environment variables.

==================================================

## Environment Variables

The project requires the following environment variables to function correctly in production. They must be injected into the Vercel project settings.

| Variable | Purpose | Required | Example |
| :--- | :--- | :--- | :--- |
| `CLOUDINARY_URL` | Authenticates the `/api/upload` route to pipe images to the CDN. | **YES** | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |
| `SHOPIFY_STORE_DOMAIN` | (Legacy/Future) Required if headless Shopify integration is activated. | NO | `gcc.tezhhomayaa.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN`| (Legacy/Future) Required for Shopify GraphQL API queries. | NO | `atkn_b9a27b7...` |

==================================================

## Configuration Files

### `next.config.ts`
The Next.js configuration is heavily optimized for media delivery.
- **Formats**: Forces `["image/avif", "image/webp"]` generation.
- **Remote Patterns**: Strictly allows `next/image` to optimize images from `res.cloudinary.com`, `cdn.shopify.com`, and `images.unsplash.com`. Attempting to load images from unapproved domains will throw a 500 error.

### Tailwind CSS
The project utilizes the new Tailwind CSS v4 engine (`@tailwindcss/postcss`). There is no `tailwind.config.ts`; configuration is handled via CSS variables in `app/globals.css`.

==================================================

## GitHub Workflow

Currently, the project does not utilize GitHub Actions (`.github/workflows`). Deployment relies entirely on Vercel's native Git integration.

- **Branch Strategy**: 
  - `main`: Represents the active production environment.
  - `feature/*`: Used for developing new VXP blocks or storefront layouts.
- **Commit Strategy**: Conventional Commits are recommended but not enforced.

==================================================

## Vercel Deployment

Tezhhomayaa is natively designed for **Vercel**.

1. **Automatic Deployment**: Pushing to `main` instantly triggers a Vercel build.
2. **Production**: The `main` branch is automatically assigned to the primary custom domain (e.g., `tezhhomayaa.com`).
3. **Preview Deployments**: Opening a PR against `main` generates an isolated URL (e.g., `tezhhomayaa-pr-1.vercel.app`) to preview the exact build.
4. **Rollback**: Instant rollbacks can be executed via the Vercel Dashboard by promoting a previous successful build.

==================================================

## Build Pipeline

The `npm run build` command executes the following sequence:

1. **Type Checking**: Validates all TypeScript interfaces (e.g., `Product`, `VXPBlock`).
2. **Linting**: Runs ESLint rules.
3. **Static Generation (SSG)**: Next.js reads the `/lib/*.json` files via Node `fs.readFile` and generates static HTML for product pages and Journal articles.
4. **Chunking**: Code splits massive libraries (like `@dnd-kit` and `@tiptap`) via `next/dynamic` so they are not included in the initial page load.

==================================================

## Production Checklist

Before going live, ensure the following:

- [ ] `CLOUDINARY_URL` is securely added to Vercel Environment Variables.
- [ ] No `localhost` URLs remain hardcoded in `products.json` or `homepage.json`.
- [ ] Custom domain DNS is correctly mapped to Vercel's nameservers.
- [ ] Admin route (`/admin`) is either disabled or protected via Middleware (See Limitations).

==================================================

## Backup Strategy

- **GitHub**: Because the database is entirely file-based (`/lib/*.json`), every `git commit` acts as an exact snapshot of the entire database and content tree.
- **Cloudinary**: Media assets are isolated and backed up by Cloudinary's infrastructure.
- **Project Documentation**: The `/docs` folder acts as the permanent blueprint for disaster recovery.

==================================================

## Current Limitations

> [!WARNING]  
> **Serverless File-System Limitation**
> Vercel Lambda functions are ephemeral. If an administrator uses the VXP Admin to update `homepage.json` in production, `fs.writeFile` will successfully execute in the Lambda's temporary memory, but **the changes will disappear** on the next request or deployment. 
> 
> **Current Workaround**: The VXP Admin must be run locally (`npm run dev`), the JSON files saved, and then committed to Git and pushed to Vercel to update the production site.

==================================================

## Future Improvements

1. **Database Migration**: Migrate the JSON files to a managed database (PostgreSQL/Prisma or Vercel KV) to allow the VXP Admin to run directly on the production URL.
2. **CI/CD Pipeline**: Introduce GitHub Actions to run automated testing (Playwright/Jest) before allowing a merge to `main`.
3. **NextAuth Middleware**: Introduce standard authentication to lock down the `/admin` routes in production.
