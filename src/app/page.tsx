'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { simulate, type Params, type State } from '../lib/physics'

type Preset = { name: string; gravity: number; subtitle: string; icon: string }
const presets: Preset[] = [
  { name: 'Earth', gravity: 9.81, subtitle: '9.81 m/s²', icon: '⊕' },
  { name: 'Moon', gravity: 1.62, subtitle: '1.62 m/s²', icon: '◐' },
  { name: 'Mars', gravity: 3.71, subtitle: '3.71 m/s²', icon: '●' },
]
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void
}) {
  return <div className="control">
    <div className="control-head"><span>{label}</span><b>{value.toFixed(step < 1 ? 2 : 0)}{unit}</b></div>
    <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    <div className="range-scale"><span>{min}{unit}</span><span>{max}{unit}</span></div>
  </div>
}

function interpolate(points: State[], t: number) {
  if (!points.length) return { t: 0, x: 0, y: 0, vx: 0, vy: 0 }
  let lo = 0, hi = points.length - 1
  while (lo < hi) {
    const m = (lo + hi) >> 1
    if (points[m].t < t) lo = m + 1
    else hi = m
  }
  const b = points[lo]
  const a = points[Math.max(0, lo - 1)] ?? b
  const f = clamp(b.t === a.t ? 0 : (t - a.t) / (b.t - a.t), 0, 1)
  return { t, x: a.x + (b.x - a.x) * f, y: Math.max(0, a.y + (b.y - a.y) * f), vx: a.vx + (b.vx - a.vx) * f, vy: a.vy + (b.vy - a.vy) * f }
}

export default function Home() {
  const [speed, setSpeed] = useState(20)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.81)
  const [drag, setDrag] = useState(false)
  const [mass, setMass] = useState(0.5)
  const [diameter, setDiameter] = useState(0.12)
  const [wind, setWind] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [clock, setClock] = useState(0)
  const [rate, setRate] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const params: Params = useMemo(() => ({ speed, angleDeg: angle, gravity, drag, mass, diameter, wind, dt: 1 / 240 }), [speed, angle, gravity, drag, mass, diameter, wind])
  const data = useMemo(() => simulate(params), [params])
  const live = useMemo(() => interpolate(data.points, clock), [data.points, clock])

  // Every physics-control change starts a fresh run, so the ball and path can never be left at an old timestamp.
  useEffect(() => setClock(0), [speed, angle, gravity, drag, mass, diameter, wind])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000) * rate
      last = now
      setClock(t => {
        const next = t + delta
        return next >= data.flightTime ? 0 : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, data.flightTime, rate])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(320, rect.width)
      const h = Math.max(300, Math.min(540, w * 0.56))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const pad = { l: 56, r: 22, t: 28, b: 48 }
      const plotW = w - pad.l - pad.r
      const plotH = h - pad.t - pad.b
      // Equal pixels-per-metre in X and Y. This prevents the graph from visually changing the meaning of the launch angle.
      const maxX = Math.max(20, data.range * 1.16)
      const maxY = Math.max(8, data.maxHeight * 1.30)
      const ppu = Math.min(plotW / maxX, plotH / maxY)
      const ox = pad.l
      const groundY = h - pad.b
      const sx = (x: number) => ox + x * ppu
      const sy = (y: number) => groundY - y * ppu

      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, '#e8f9ff')
      bg.addColorStop(1, '#fff5e7')
      ctx.fillStyle = bg
      ctx.beginPath(); ctx.roundRect(0, 0, w, h, 22); ctx.fill()

      ctx.save()
      ctx.beginPath(); ctx.roundRect(0, 0, w, h, 22); ctx.clip()
      ctx.strokeStyle = 'rgba(78,113,130,.14)'
      ctx.lineWidth = 1

      const xTicks = 6
      for (let i = 0; i <= xTicks; i++) {
        const x = sx(i * maxX / xTicks)
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, groundY); ctx.stroke(); ctx.fillStyle='#6d8794'; ctx.font='600 9px ui-sans-serif,system-ui'; ctx.fillText(`${(i * maxX / xTicks).toFixed(0)} m`, x - 9, groundY + 16)
      }
      const yTicks = 5
      for (let i = 0; i <= yTicks; i++) {
        const y = sy(i * maxY / yTicks)
        ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(Math.min(w - pad.r, sx(maxX)), y); ctx.stroke(); if(i>0){ctx.fillStyle='#6d8794';ctx.font='600 9px ui-sans-serif,system-ui';ctx.fillText(`${(i * maxY / yTicks).toFixed(0)} m`, 10, y + 3)}
      }

      ctx.strokeStyle = '#566e7b'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(ox, groundY); ctx.lineTo(Math.min(w - pad.r, sx(maxX)), groundY); ctx.moveTo(ox, groundY); ctx.lineTo(ox, pad.t); ctx.stroke()

      // Physical trajectory.
      ctx.strokeStyle = '#ff645b'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      data.points.forEach((p, i) => { const x = sx(p.x), y = sy(p.y); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y) })
      ctx.stroke()

      // Launch vector and angle arc are derived from exactly the same slider angle.
      const theta = angle * Math.PI / 180
      const vectorLen = clamp(54 + speed * 0.35, 62, 78)
      const vxPx = Math.cos(theta) * vectorLen
      const vyPx = Math.sin(theta) * vectorLen
      ctx.strokeStyle = '#176b8c'
      ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(ox, groundY); ctx.lineTo(ox + vxPx, groundY - vyPx); ctx.stroke()
      const head = 8
      const dir = Math.atan2(-vyPx, vxPx)
      ctx.beginPath(); ctx.moveTo(ox + vxPx, groundY - vyPx); ctx.lineTo(ox + vxPx - head * Math.cos(dir - 0.45), groundY - vyPx - head * Math.sin(dir - 0.45)); ctx.moveTo(ox + vxPx, groundY - vyPx); ctx.lineTo(ox + vxPx - head * Math.cos(dir + 0.45), groundY - vyPx - head * Math.sin(dir + 0.45)); ctx.stroke()
      ctx.strokeStyle = 'rgba(23,107,140,.65)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(ox, groundY, 42, 0, -theta, true); ctx.stroke()
      ctx.fillStyle = '#176b8c'
      ctx.font = '800 11px ui-sans-serif,system-ui'
      ctx.fillText(`θ = ${angle}°`, ox + 44, groundY - 10)

      ctx.fillStyle = '#176b8c'
      ctx.beginPath(); ctx.arc(ox, groundY, 7, 0, Math.PI * 2); ctx.fill()

      const bx = sx(live.x), by = sy(live.y)
      const glow = ctx.createRadialGradient(bx, by, 2, bx, by, 24)
      glow.addColorStop(0, 'rgba(255,102,92,.42)')
      glow.addColorStop(1, 'rgba(255,102,92,0)')
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(bx, by, 24, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#ff554d'; ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx - 3, by - 3, 3, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#658090'
      ctx.font = '600 10px ui-sans-serif,system-ui'
      ctx.fillText('height (m)', ox + 8, pad.t + 10); ctx.fillStyle='#173047'; ctx.font='800 10px ui-sans-serif,system-ui'; ctx.fillText(`1:1 physical scale • ${ppu.toFixed(1)} px/m`, ox + 8, pad.t + 24)
      ctx.fillText('distance (m)', Math.min(w - 92, sx(maxX) - 76), groundY + 29)
      ctx.font = '800 10px ui-sans-serif,system-ui'
      ctx.fillText(drag ? 'RK4 • QUADRATIC DRAG' : 'RK4 • IDEAL GRAVITY', Math.max(ox + 120, w - 170), pad.t + 10)
      ctx.restore()
    }

    draw()
    const obs = new ResizeObserver(draw)
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [data, live, drag, angle, speed])

  const reset = () => { setClock(0); setPlaying(true) }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">↗</div><div><div className="brand-name">VECTOR LAB / IXO</div><div className="brand-sub">Interactive Physics Studio</div></div></div>
      <div className="top-actions"><span className="status-dot"/>RK4 numerical model <span className="desktop-only">• SI units</span></div>
    </header>

    <section className="hero"><div><div className="eyebrow">PHYSICS • SIMULATE • SEE WHY</div><h1>Make physics <span>move.</span></h1><p>Change the variables. Watch the motion. The curve, moving object and measurements all come from the same numerical state.</p></div><div className="hero-orbit" aria-hidden="true"><div className="orbit-center">g</div><span className="orbit-dot a"/><span className="orbit-dot b"/><span className="orbit-dot c"/></div></section>

    <section className="lab-grid">
      <aside className="sidebar glass"><div className="side-title">EXPERIMENTS</div><button className="experiment active"><span className="exp-icon">↗</span><span><b>Projectile motion</b><small>Trajectory & dynamics</small></span><span>›</span></button><button className="experiment disabled"><span className="exp-icon">⟳</span><span><b>Simple pendulum</b><small>Coming next</small></span><span>›</span></button><button className="experiment disabled"><span className="exp-icon">⌁</span><span><b>RC circuit</b><small>Coming next</small></span><span>›</span></button><div className="side-note"><b>Model integrity</b><p>Changing a control recomputes the trajectory and restarts the animation from the physical launch state.</p></div></aside>

      <section className="workspace">
        <article className="canvas-card glass"><div className="canvas-head"><div><div className="mini-label">LIVE SIMULATION</div><h2>Projectile Motion</h2></div><div className="head-actions"><button className="speed-chip" onClick={()=>setRate(v=>v===1?2:v===2?.5:1)}>×{rate}</button><button className={`speed-chip`} onClick={reset}>↻</button><button className={`play-btn ${playing?'on':''}`} onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ':'▶'} <span>{playing?'Running':'Paused'}</span></button></div></div><div className="stage-wrap" ref={wrapRef}><canvas ref={canvasRef} role="img" aria-label="Animated projectile motion simulation"/></div><div className="scale-pill">TRUE PHYSICAL SCALE · SAME m SCALE ON X & Y</div><div className="motion-pill"><span className="pulse-dot"/><span>t <b>{live.t.toFixed(2)} s</b></span><span>x <b>{live.x.toFixed(1)} m</b></span><span>y <b>{live.y.toFixed(1)} m</b></span><span>|v| <b>{Math.hypot(live.vx, live.vy).toFixed(1)} m/s</b></span></div></article>

        <div className="below-grid">
          <article className="panel glass"><div className="panel-head"><div><div className="mini-label">PARAMETERS</div><h3>Change the world</h3></div><span className="tiny-badge">LIVE</span></div><div className="presets">{presets.map(p=><button key={p.name} className={Math.abs(gravity-p.gravity)<.01?'selected':''} onClick={()=>setGravity(p.gravity)}><span>{p.icon}</span><b>{p.name}</b><small>{p.subtitle}</small></button>)}</div><Slider label="Initial velocity" value={speed} min={5} max={50} step={1} unit=" m/s" onChange={setSpeed}/><Slider label="Launch angle" value={angle} min={5} max={85} step={1} unit="°" onChange={setAngle}/><Slider label="Gravity" value={gravity} min={1} max={20} step={.01} unit=" m/s²" onChange={setGravity}/><div className="switch-row"><span><b>Air resistance</b><small>Quadratic drag + wind</small></span><button aria-label="Toggle air resistance" className={`switch ${drag?'on':''}`} onClick={()=>setDrag(v=>!v)}><span/></button></div>{drag&&<div className="drag-controls"><Slider label="Projectile mass" value={mass} min={.05} max={2} step={.05} unit=" kg" onChange={setMass}/><Slider label="Diameter" value={diameter} min={.03} max={.30} step={.01} unit=" m" onChange={setDiameter}/><Slider label="Wind" value={wind} min={-15} max={15} step={1} unit=" m/s" onChange={setWind}/></div>}</article>

          <article className="panel glass"><div className="panel-head"><div><div className="mini-label">MEASUREMENTS</div><h3>What the model predicts</h3></div><span className="formula-chip">F<sub>d</sub> ∝ v²</span></div><div className="metrics"><div className="metric"><span>Range</span><b>{data.range.toFixed(2)} <i>m</i></b></div><div className="metric"><span>Max height</span><b>{data.maxHeight.toFixed(2)} <i>m</i></b></div><div className="metric"><span>Flight time</span><b>{data.flightTime.toFixed(2)} <i>s</i></b></div><div className="metric"><span>Impact speed</span><b>{data.impactSpeed.toFixed(2)} <i>m/s</i></b></div></div><div className="equation-strip"><span>vₓ₀</span><b>{data.initialVx.toFixed(2)}</b><span>vᵧ₀</span><b>{data.initialVy.toFixed(2)}</b><span>peak @</span><b>{data.peakTime.toFixed(2)} s</b></div><div className="explain"><div className="explain-dot">?</div><div><b>Try an experiment</b><p>Move the angle from 15° → 45° → 75°. The launch vector, angle arc and physical trajectory now change together. Then switch gravity or add drag and compare the result.</p></div></div></article>
        </div>
      </section>
    </section>

    <footer className="footer"><span>VECTOR LAB / IXO</span><span className="maintainer"><span className="maintainer-mark">HP</span><span>Maintained by <b>Himesh Purohit</b></span></span><span className="desktop-only">Phone • tablet • desktop</span></footer>
  </main>
}
