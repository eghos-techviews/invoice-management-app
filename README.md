# Invoice Management App

A fully responsive invoice management application built with React + TypeScript.

## Live Demo
stunning-crisp-f1d579.netlify.app

## Setup Instructions

1. Clone the repository
   git clone https://github.com/eghos-techviews/invoice-management-app.git

2. Navigate into the project
   cd invoice-management-app

3. Install dependencies
   npm install

4. Start the development server
   npm run dev

5. Open http://localhost:5173 in your browser

## Architecture

## Architecture Explanation

The project follows a component-based architecture using React with TypeScript. State is managed globally via React Context API, avoiding the need for third-party state management libraries.

src/
├── components/
│   ├── Button/            # Reusable button with multiple style variants
│   ├── FilterDropdown/    # Status filter with accessible checkbox UI
│   ├── InvoiceCard/       # Single invoice row displayed in the list
│   ├── InvoiceForm/       # Slide-in drawer for creating and editing invoices
│   ├── Modal/             # Accessible confirmation dialog for deletion
│   ├── Sidebar/           # Navigation sidebar with theme toggle
│   └── StatusBadge/       # Colour-coded status indicator (draft/pending/paid)
├── context/
│   ├── InvoiceContext.tsx  # Global invoice state and all CRUD operations
│   └── ThemeContext.tsx    # Light and dark mode state management
├── pages/
│   ├── ListPage.tsx        # Main invoice list view with filter
│   └── DetailPage.tsx      # Full detail view for a single invoice
├── types/
│   └── invoice.ts          # TypeScript interfaces for Invoice and related types
├── utils/
│   └── generateId.ts       # Generates random invoice IDs (e.g. RT3080)
└── styles/
└── global.css          # Global CSS variables and theme tokens


### Key Architecture Decisions

- **React Context API** is used for both invoice data and theme state, making them accessible to any component without prop drilling.
- **CSS Modules** are used for component-level style scoping, preventing class name collisions across components.
- **React Router v6** handles navigation between the invoice list and invoice detail pages.
- **localStorage** persists all invoice data and theme preference across browser sessions.

## Trade-offs

- **localStorage over IndexedDB or a backend**: localStorage was chosen for speed of delivery and simplicity. For a production application with multiple users or large datasets, a backend with a database (e.g. Node/Express + PostgreSQL) would be more appropriate.
- **CSS Modules over Tailwind CSS**: Tailwind was considered but skipped due to environment compatibility issues on the development machine. CSS Modules provided full styling control with zero configuration overhead.
- **No authentication**: The app assumes a single user. A real-world version would require user accounts and protected routes.
- **In-memory form state**: The invoice form resets on close. A more robust version could auto-save form progress to localStorage as a backup draft.

## Accessibility Notes

- All form fields have associated `<label>` elements with matching `htmlFor` and `id` attributes.
- All interactive elements use semantic `<button>` elements — no div or span click handlers.
- The delete confirmation modal:
  - Traps focus inside while open
  - Closes on ESC key press
  - Uses `role="dialog"` and `aria-modal="true"`
  - Has an accessible title via `aria-labelledby`
- Icon-only buttons have descriptive `aria-label` attributes.
- Form validation errors use `role="alert"` so screen readers announce them immediately.
- The theme toggle button announces the target state e.g. "Switch to dark mode".
- Keyboard navigation is fully supported across all interactive elements.
- Color contrast meets WCAG AA standards in both light and dark mode.
- The `.sr-only` utility class is available for visually hidden but screen-reader-accessible text.

## Improvements Beyond Requirements

- **Mark as Pending**: Draft invoices can be promoted to Pending status, not just to Paid — giving a proper three-stage workflow.
- **Auto-calculated totals**: Invoice item totals calculate automatically as quantity and price are entered.
- **Auto-calculated payment due date**: The due date is computed automatically from the invoice creation date plus the selected payment terms.
- **Smooth animations**: The invoice form slides in from the left with a cubic-bezier transition for a polished feel.
- **Responsive sidebar**: The sidebar collapses from a vertical left rail on desktop to a horizontal top bar on mobile.
- **Theme persistence**: The user's light/dark preference is saved to localStorage and restored on every page reload.
- **Empty state per filter**: When filtering returns no results, a contextual message is shown indicating which status has no invoices.
- **Custom scrollbar**: Styled scrollbar in the form drawer maintains visual consistency with the overall design.