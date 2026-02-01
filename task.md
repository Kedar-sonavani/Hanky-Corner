# Hanky Corner Development Tasks
> [!NOTE]
> All requested Inventory Safeguards, Security Refinements, and UI Redesigns are now COMPLETE.


## Phase 9: Advanced Inventory & Admin (Refinements)
- [x] Fix "Out of Stock" indicators on Product Detail Page.
- [x] Implement stock-aware quantity selector on Detail Page.
- [x] Add "Low Stock" visual warnings (< 5 units).
- [x] Ensure atomic stock decrement using Database RPC.
- [x] Implement quick stock adjustment buttons (+/-) in Admin Dashboard.
- [x] Add discount price system in Admin and Product views.
- [x] Ensure price is visible in "Showcase Only" mode.
- [x] Redesign Product Card UI to match premium Jockey-style layout.

## Inventory Edge Cases & Safeguards
- [x] **Cart Validation**: Check total cart quantity against available stock before allowing "Add to Bag".
- [x] **Admin Deletion Safety**: Prevent deletion of products that are part of "Processing" or "Shipped" orders.
- [x] **Stock Threshold Alerts**: Notify admin in the dashboard when items reach a critical low stock level (2 units).
- [x] **Over-purchase Prevention**: Atomic DB check during final order placement.
- [x] **Image Management**: Premium placeholders for products with no images.


## Phase 10: Authentication & Security
- [x] Replace `x-admin-secret` with proper JWT/Session-based auth.
- [x] Secure administrative routes on the server.
- [x] Hero Model Image Integration.

## Phase 11: Premium UI Redesign
- [x] Design System Foundation (Fonts, Colors, Global Styles).
- [x] Layout Overhaul (Header, Footer, Mobile Navigation).
- [x] Home Page Redesign (Hero, Featured, Storytelling).
- [x] Product Listing Page (Grid, Filters, Interactions).
- [x] Product Detail Page (Gallery, Info, Add to Cart Experience).
- [x] Cart & Checkout Redesign.
- [x] Admin Dashboard UI Refresh.
- [x] Implement 'Page A' Homepage Design (Navbar, Hero, Product Cards).
- [x] Phase 12: Cart & Security Refinements
    - [x] Cart Stock Validation (Client & Context updates)
    - [x] JWT-based Admin Authentication (Server & Middleware)
    - [x] Admin Login Interface
    - [x] Auth-Gated Checkout (Require login for purchase)

## Phase 13: Authentication Refinements
- [x] Implement "Forgot Password" flow.
- [x] Implement "Sign in with Google" (OAuth).
- [x] Create "Update Password" secure page.
- [x] Add sophisticated Auth UI transitions.



