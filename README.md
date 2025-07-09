# Ordo UI monorepo

This is the Ordo UI monorepo built with shadcn/ui and bun.

## Usage

```bash
bun x shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
bun x shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@ordo/ui/components/button"
```
