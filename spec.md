# Specification

## Summary
**Goal:** Add Internet Identity authentication so that only the designated admin (Kim Chau) can create, edit, or delete blog posts and portfolio entries, while visitors can read all content freely without logging in.

**Planned changes:**
- Add backend access control to reject unauthenticated or non-admin principals on all write operations (create, update, delete) for blog posts and portfolio items; read operations remain public.
- Track and verify the admin principal server-side.
- Add a Login/Logout button to the navigation bar using Internet Identity; show "Login" when unauthenticated and "Logout" when authenticated.
- Hide all Add Post, Edit, and Delete controls from unauthenticated visitors across the Blog, Portfolio, and Admin pages; reveal them immediately upon successful admin login.
- Protect AdminBlogPage and AdminPortfolioPage so that unauthenticated or non-admin users see an access-denied message or are redirected to the homepage.

**User-visible outcome:** Visitors can browse all blog posts and portfolio entries without logging in. Kim Chau can click "Login" in the nav, authenticate via Internet Identity, and then see admin controls to create, edit, or delete content. Logging out hides all admin controls immediately.
