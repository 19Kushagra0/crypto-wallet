---
name: Aura Wallet Design System
colors:
  background: '#0f172a'
  foreground: '#f8fafc'
  card: 'rgba(30, 41, 59, 0.7)'
  primary: '#3b82f6'
  accent: '#8b5cf6'
  border: 'rgba(255, 255, 255, 0.1)'
  destructive: '#ef4444'
  muted: '#334155'
  muted-foreground: '#94a3b8'
rounded:
  sm: '0.3rem'
  DEFAULT: '0.5rem'
  md: '0.75rem'
  lg: '1rem'       # used for standard cards
  xl: '1.5rem'     # used for large containers
typography:
  fontFamily: 'system-ui, -apple-system, sans-serif'
---

## Brand & Style
Aura Wallet is a premium non-custodial crypto wallet. The aesthetic is **Modern/Futuristic Dark Mode** featuring heavy use of **Glassmorphism** and ambient light leak gradients. 

The interface should feel glowing, high-tech, yet extremely clean and minimal, reducing cognitive load for financial transactions.

## Design Rules & Elements

### Glassmorphism
Interactive surfaces must use the `.glass-card` styling:
- Linear gradient background: `from-slate-800/80 to-slate-900/90`
- Backdrop blur: `16px`
- Border: `1px solid rgba(255, 255, 255, 0.05)`
- Shadow: Soft ambient black drop shadow

### Accent Gradients & Glows
- Key headers and brand marks use a text gradient: `from-blue-500 to-purple-500`.
- The background features ambient glowing spheres (`radial-gradient` using primary/accent colors with `120px` blurs and slow breathing animations).

### Components
- **Primary Buttons:** Gradient fill (`from-blue-500 to-purple-500` or solid primary blue), fully rounded corners (`12px`), with bold contrasting white labels.
- **Inputs & Textareas:** Dark transparent background (`rgba(0, 0, 0, 0.4)`), thin border (`rgba(255, 255, 255, 0.1)`), and active blue/purple rings on focus.
