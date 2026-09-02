import type {Metadata} from 'next'
import './globals.css'
export const metadata:Metadata={title:'Vector Lab — Interactive Physics Simulator',description:'Explore projectile motion with a numerical physics simulator. Change velocity, launch angle and gravity and see the trajectory respond.',keywords:['physics simulator','projectile motion simulator','JEE physics']}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}