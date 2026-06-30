# Dashboard Layout Lock (Project Constraint)

From this point onward, the dashboard layout is considered finalized and locked.
This means the following must remain pixel-stable throughout all future implementation:

## Layout Lock Rules
- Do not move, resize, reposition, or rebalance any of the existing dashboard sections.
- Do not change the spacing between sections.
- Do not alter the dashboard's overall height or viewport fit.
- The dashboard must continue to fit within 100vh with no scrolling.

## Locked Containers
The following containers are now permanently locked:
- Hero Banner
- KPI Row
- Workspace Row
  - Proactive Alerts
  - Knowledge Graph Overview
  - AI Decision Brief
- Bottom Row
  - Recent Documents
  - Recent Queries
  - System Health

## Container Rules
Future work must only populate these containers with functionality and data.
Do not change:
- container width
- container height
- container position
- margins
- padding
- gaps
- border radius
- alignment
- grid/flex structure

## Internal Component Rules
Content inside each container must also respect its existing layout.
Do not move:
- titles
- buttons
- icons
- badges
- charts
- lists
- action buttons
- placeholders

Future implementation should replace placeholder content with functional components, not redesign or reposition the layout.

## Future Development Rule
Every future sprint must treat this dashboard as a fixed design system.
New functionality should be implemented inside the existing containers only.
If additional information is required later, it should use:
- expandable panels,
- modal dialogs,
- drawers,
- overlays,
- tabs,
- or internal scrolling,
rather than resizing or moving the existing dashboard layout.

**Constraint**: Any future modification that changes the current dashboard layout, dimensions, spacing, or positioning should be considered out of scope unless explicitly approved.

# Dual Layout Architecture (Permanent Rule)

The Dashboard Home and the Workspace Pages are two different layout systems.

## Dashboard Home:
- Fixed
- Locked
- Non-scrollable
- 100vh fit
- Immutable

## Workspace Pages:
- Scrollable
- Expandable
- Content-driven
- Unlimited vertical space

Under no circumstances should implementing a workspace feature alter the Dashboard Home layout. Detailed information must never leak back into the dashboard preview. The dashboard should always remain a clean executive overview, while workspaces handle depth and unbounded scrolling.

# Global Content Margin System (Permanent Rule)

Every PRIMARY PAGE rendered from the left sidebar navigation must follow one single global content container (`PageContainer`).
This includes the Dashboard, Decision Assistant, Knowledge Graph, Documents, and any future module.

## Margin Rules
- The outer spacing (margins/padding) belongs exclusively to the global `PageLayout` / `PageContainer`.
- Individual pages must NEVER define their own outer margin, padding, or top/bottom/left/right spacing.
- The scroll container must live INSIDE the content wrapper, so the scrollbar remains correctly inset and margins remain visible.
- The Dashboard remains the visual reference for this global spacing (using `DESIGN_TOKENS.layout.pageMargin`).

## Internal Component Rules
- This rule only applies to OUTER spacing.
- Internal component spacing (card spacing, grid gaps, row gaps) must be kept and respected.
- Future modules automatically inherit this layout simply by rendering their content. No engineer or AI agent should manually redefine outer spacing.
