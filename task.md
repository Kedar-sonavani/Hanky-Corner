# Hanky Corner Development Tasks

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
- [ ] **Cart Validation**: Check total cart quantity against available stock before allowing "Add to Bag" (currently only checks per-addition quantity).
- [ ] **Admin Deletion Safety**: Add a warning or prevent deletion of products that are part of "Processing" or "Shipped" orders.
- [ ] **Stock Threshold Alerts**: Notify admin in the dashboard when items reach a critical low stock level (e.g., 2 units).
- [ ] **Over-purchase Prevention**: If multiple users have the last item in their cart, the first to checkout wins, and others get an "Out of Stock" error during session checkout (Atomic DB check needed during final order placement).
- [ ] **Image Management**: Handle edge cases where a product has no images (add a premium placeholder).

## Phase 10: Authentication & Security
- [ ] Replace `x-admin-secret` with proper JWT/Session-based auth.
- [ ] Secure administrative routes on the server.
- [ ] Implement secure image proxy if using external media.
