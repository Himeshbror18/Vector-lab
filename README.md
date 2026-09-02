# Vector Lab 🔭

> **An interactive physics laboratory for visualising projectile motion — not just calculating it.**

[![MIT License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

Vector Lab turns the equations of projectile motion into something you can **see, change, and reason about**. Adjust launch conditions and environmental parameters, then watch the trajectory, measurements, and motion respond in real time.

## ✨ What it does

- 🎯 Interactive projectile launching with live trajectory rendering
- 🎚️ Touch-friendly controls for velocity, angle, gravity, launch height, wind and drag
- 🌍 Presets for Earth, Moon and Mars gravity
- 🌬️ Optional quadratic air resistance with configurable physical parameters
- 📐 Live decomposition into horizontal and vertical velocity components
- 📊 Range, maximum height, flight time and impact speed computed from the same simulation state
- ⏱️ Animation driven by physical simulation time rather than a fixed visual loop
- 📱 Responsive UI for phones, tablets and desktop screens
- 🧠 Explanations that connect the graph to the underlying equations

## 🧪 The physics

For ideal projectile motion without drag:

\[
 x(t)=x_0+v_0\cos(\theta)t
\]

\[
 y(t)=y_0+v_0\sin(\theta)t-\frac12gt^2
\]

From these equations:

\[
T=\frac{v_0\sin\theta+\sqrt{(v_0\sin\theta)^2+2gy_0}}{g}
\]

\[
R=v_0\cos\theta\,T
\]

and for launch from ground level, the familiar maximum-height and range relations follow.

### With air resistance

The simulator can use a quadratic drag model based on relative air velocity:

\[
\vec F_d=-\frac12\rho C_d A|\vec v-\vec v_w|(\vec v-\vec v_w)
\]

The resulting acceleration is integrated numerically. This matters because once drag or wind is enabled, the closed-form vacuum equations no longer describe the trajectory exactly.

### Numerical integration

Vector Lab uses a fixed-step **Runge–Kutta 4 (RK4)** integrator for the motion model. The renderer consumes the resulting state rather than inventing a separate visual trajectory.

That design choice is deliberate: when a parameter changes, the **physics**, **numbers**, **graph**, and **animation** should all change together.

## 🎨 Design principles

Vector Lab is intentionally bright, tactile and visual. Controls are large enough for touch interaction, important quantities have strong visual hierarchy, and motion uses restrained spring/bounce easing so interaction feels responsive without obscuring the physics.

The visual system also avoids the common simulator mistake of auto-scaling each trajectory independently. The graph keeps a meaningful physical coordinate system so changes in gravity, angle or drag remain visually apparent.

## 🛠️ Tech stack

- **Next.js** — application framework
- **React + TypeScript** — UI and simulation state
- **CSS** — responsive visual system and motion
- **Canvas/SVG rendering** — trajectory and motion visualisation
- **Vercel** — deployment

No server-side physics service is required for the core simulator; the motion model runs in the browser.

## 🚀 Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Create a production build with:

```bash
npm run build
npm start
```

## 📁 Project direction

The first module is projectile motion. The long-term goal is to turn Vector Lab into a small browser-based physics laboratory with additional interactive experiments such as:

- Simple pendulum
- SHM
- Newton's laws and collisions
- RC capacitor charging/discharging
- Ray optics
- Electric fields and potential

Each module should follow the same standard: **correct model first, visual explanation second, polish third.**

## ⚠️ Model assumptions

The simulator is educational rather than a full computational-fluid-dynamics tool. Air-resistance mode uses a lumped drag coefficient and atmospheric density rather than modelling changing flow fields. Numerical results therefore depend on the chosen physical parameters and assumptions.

## 📚 Why this project exists

Physics is often taught as a chain of equations on a page. Vector Lab is built around a different idea:

> **Change one variable. Watch the consequence. Then explain why.**

It is intended to make the relationship between equations, motion and measurable quantities easier to understand — especially for students learning mechanics.

## 🤝 Contributing

Issues and pull requests are welcome. For substantial changes, explain the physics model and assumptions being changed, not only the UI implementation.

## 📄 License

Released under the [MIT License](LICENSE).
