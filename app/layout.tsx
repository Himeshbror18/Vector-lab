import type { Metadata } from 'next'
import './premium.css'

export const metadata: Metadata = {
  title: 'Vector Lab — Interactive Physics Simulator',
  description: 'Explore projectile motion with a responsive numerical physics simulator. Change velocity, launch angle, gravity, wind and air resistance and watch the trajectory respond in real time.',
  keywords: ['physics simulator','projectile motion simulator','JEE physics','gravity simulator','air resistance simulator'],
  openGraph: {title:'Vector Lab — Interactive Physics Simulator',description:'See projectile motion respond to velocity, angle, gravity, wind and air resistance.',type:'website'},
}

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
