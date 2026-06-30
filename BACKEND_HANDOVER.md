# Backend Handover Guide

Welcome to the backend handover for IndustroMind. The frontend has been intentionally architected to be 100% backend-ready. This document outlines exactly what needs to be implemented to bring the application to life.

## Core Philosophy
- **UI is Dumb**: The UI layer holds no business logic.
- **Props Down, Callbacks Up**: Data is fetched by top-level Page components (or React Query/SWR in the future) and passed down as props to the presentational components. Events flow back up via standard callbacks (e.g., `onExecute`, `onSelect`).
- **Data Models**: The frontend relies on strictly typed TypeScript interfaces for all entities. See `features/[domain]/types/` for the expected JSON shapes.

## 1. Authentication (Sprint 21 Integration)
**Status**: The `/auth/login` and `/auth/register` pages have forms that capture state and trigger mock delays.
**Action Required**:
- Integrate Supabase, Auth0, NextAuth, or custom JWT authentication.
- Replace the `handleLogin` and `handleRegister` functions in `features/auth/pages/LoginPage.tsx` and `RegisterPage.tsx`.
- Connect the Microsoft and Google OAuth callbacks inside `ProviderButton.tsx`.
- Establish session management (cookies or JWT) and wrap the `/demo/*` routes in a middleware guard.

## 2. API Implementation (CRUD & Metrics)
**Status**: All modules (Assets, Compliance, Reports, Expert Knowledge) are populated by mock data located in `features/[domain]/constants/`.
**Action Required**:
- Build REST or GraphQL APIs to serve this data.
- Recommended Endpoints:
  - `GET /api/dashboard/metrics`
  - `GET /api/assets` & `GET /api/assets/:id`
  - `GET /api/compliance/status` & `GET /api/compliance/regulations/:id`
  - `GET /api/reports` & `POST /api/reports/generate`
  - `GET /api/expert-knowledge` & `POST /api/expert-knowledge`

## 3. Server-Sent Events (SSE) & WebSockets
**Status**: The platform heavily relies on real-time neuro-symbolic reasoning simulations (e.g., Decision Assistant generating steps, Reports generating narratives).
**Action Required**:
- The UI handles streaming by appending text to state arrays (see `features/decision-assistant/components/ChatWorkspace.tsx` and `features/reports/components/ReportGenerationWorkspace.tsx`).
- Implement real WebSocket or SSE endpoints to stream token generation from the LLM/Agentic backend to the UI.

## 4. GraphRAG Integration
**Status**: The `features/knowledge-graph` uses `react-force-graph-2d` and expects a standard `GraphData` object (`{ nodes: [], links: [] }`).
**Action Required**:
- Expose an endpoint `GET /api/graph/subgraph?query=...` that returns nodes and edges formatted exactly as defined in `features/knowledge-graph/types/graph.ts`.
- The frontend will automatically handle the 2D rendering and collision detection.

## 5. Next Steps for the Backend Developer
1. **Remove Mocks**: Go through `features/*/constants/` and replace the mock imports with standard data fetching logic (e.g., TanStack React Query or Next.js App Router Server Components).
2. **Wire State**: Connect the top-level Page components to the new fetchers.
3. **Connect Auth**: Implement the auth hooks and wrap the application.

*End of Handover*
