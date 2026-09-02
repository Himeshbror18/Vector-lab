# Vector Lab / IXO 🔭

> An interactive physics laboratory for visualising projectile motion — not just calculating it.

Vector Lab / IXO turns projectile-motion equations into something you can see, change, and reason about. Adjust launch conditions and environmental parameters, then watch the trajectory, animation and measurements respond from the same numerical state.

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

The simulator resolves initial velocity into components and integrates the state with fixed-step Runge–Kutta 4 (RK4). Ground impact is interpolated between numerical samples. With air resistance enabled, it uses quadratic drag based on velocity relative to wind.

## 🎨 Design direction

Bright tactile experiment panels, glass-like surfaces, clear hierarchy, physical axes and compact touch-friendly controls. The canvas scales to its available width instead of forcing a fixed desktop viewport.

## 🛠️ Tech stack

- Next.js + React
- TypeScript
- HTML5 Canvas
- Responsive CSS
- Vercel

## 🚀 Run locally

npm install
npm run dev

Open http://localhost:3000.

## 🤝 Maintainer

Himesh Purohit maintains Vector Lab / IXO.

## 📄 License

MIT License.
