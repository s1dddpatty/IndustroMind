# IndustroMind - Enterprise Industrial AI Platform

IndustroMind is a unified Asset & Operations Brain designed to transform industrial knowledge into operational intelligence. This repository contains the frontend implementation of the platform.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion & GSAP
- **Icons**: Lucide React
- **Graph Visualization**: react-force-graph-2d

## Project Architecture (Feature-Driven)
We utilize a strict feature-driven architecture to ensure scalability and backend-readiness.

```text
/app                  # Next.js App Router (Entry points & Layouts)
/features             # Domain-specific modules
  /auth               # Authentication & Organization Onboarding
  /dashboard          # Executive metrics and active queries
  /decision-assistant # Neuro-symbolic chat interface
  /knowledge-graph    # Industrial entity visualization
  /assets             # Asset Intelligence Hub
  /compliance         # Compliance Intelligence Center
  /expert-knowledge   # Tacit knowledge capture
  /reports            # Executive intelligence generation
  /documents          # Document processing
/components           # Global reusable UI (Buttons, Inputs, etc.)
/constants            # Global design tokens and layout configs
```

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## Design Philosophy
- **Dark Mode Native**: The application is permanently locked to a premium Dark Mode.
- **Layout Constraints**: The application features a 100vh locked dashboard with scrollable sub-workspaces, adhering to a strict global `PageContainer` margin system.

## Backend Integration
This frontend is **100% backend-ready**. All data is currently driven by mock models located in the `features/[domain]/constants/` directories. UI components are entirely decoupled from business logic and communicate exclusively via standard React props and callbacks. See `BACKEND_HANDOVER.md` for detailed integration points.
