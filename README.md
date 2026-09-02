# Vector Lab 🔭

> **An interactive physics laboratory for visualising projectile motion — not just calculating it.**

[![MIT License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

Vector Lab turns projectile-motion equations into something you can **see, change, and reason about**. Adjust launch conditions and environmental parameters, then watch the trajectory, animation and measurements respond from the same numerical state.

## ✨ What it does

- 🎯 Interactive projectile-motion simulation with live trajectory rendering
- 🎚️ Touch-friendly controls for launch velocity, angle and gravity
- 🌍 Earth, Moon and Mars gravity presets
- 🌬️ Optional quadratic air resistance using relative wind velocity
- ⚖️ Configurable projectile mass and diameter when drag is enabled
- 📊 Live range, maximum height, flight time and impact speed
- 🧭 Live time, position and velocity readouts during playback
- ⏱️ Playback speed control and pause/play
- 📱 Responsive layout for phone, tablet and desktop screens
- 🧠 Short explanations connecting the visual result to the physics

## 🧪 Physics model

For ideal projectile motion, the simulator starts with

\[
v_{x0}=v_0\cos(\theta),\qquad v_{y0}=v_0\sin(\theta)
\]

and integrates the state forward under gravity. Ground impact is interpolated between numerical samples so the reported landing point is not simply the first sample below zero.

### With air resistance

The drag mode uses a quadratic drag model based on relative air velocity:

\[
\vec F_d=-\frac12\rho C_d A|\vec v-\vec v_w|(\vec v-\vec v_w)
\]

where \(\rho=1.225\,kg/m^3\) and \(C_d=0.47\) are the educational default atmosphere and spherical drag coefficient.

### Numerical integration

The motion state is integrated with fixed-step **Runge–Kutta 4 (RK4)**. The same simulated trajectory feeds the canvas renderer and the reported measurements, avoiding a decorative animation that is disconnected from the calculated result.

## 🎨 Design direction

The interface is intentionally bright, tactile and visual: glass-like experiment panels, clear hierarchy, meaningful axes, responsive cards and compact controls sized for touch. The canvas scales to its available width instead of forcing a fixed desktop viewport.

The trajectory is drawn in physical coordinates rather than using a separate decorative curve. Changing angle, gravity, wind or drag therefore changes both the numbers and the visible motion.

## 🛠️ Tech stack

- **Next.js + React** — application framework and UI state
- **TypeScript** — physics model and typed interface
- **HTML5 Canvas** — responsive simulation rendering
- **CSS** — responsive visual system and interaction states
- **Vercel** — production hosting

The core simulation runs entirely in the browser.

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm start
```

## 📁 Roadmap

The first module is projectile motion. Planned experiments include simple pendulum motion, SHM, collisions and momentum, RC circuits, ray optics and electric fields.

Each module follows the same rule: **correct model first, visual explanation second, polish third.**

## ⚠️ Model assumptions

Vector Lab is an educational simulator, not a computational-fluid-dynamics solver. Air resistance uses a lumped drag coefficient and constant reference air density; it does not model changing atmospheric flow fields or turbulence.

## 🤝 Maintainer

**Himesh Purohit** maintains Vector Lab.

## 📄 License

Released under the [MIT License](LICENSE).
