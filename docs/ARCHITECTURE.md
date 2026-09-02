# Vector Lab Architecture

## Web application

- `app/page.tsx` — interactive experiment UI, controls, animation loop and canvas renderer.
- `app/premium.css` — complete responsive visual system.
- `lib/physics.ts` — deterministic projectile-motion model and RK4 integration.
- `app/layout.tsx` — metadata and global application shell.
- `app/robots.ts` / `app/sitemap.ts` — search-engine discovery.
- `public/` — static branding assets.

## Android

`android/` contains the lightweight Android shell used to package the web experience as an APK. The Android build is kept separate from the Next.js source.

## Data flow

Controls → typed physics parameters → RK4 simulation → trajectory + measurements → canvas/UI.

The renderer does not invent a separate trajectory. It visualises the same numerical trajectory returned by the physics engine.

## Design rule

**Physics first. Visualisation second. Polish third.**

Any new experiment should follow the same separation so that visual changes cannot silently alter the underlying model.
