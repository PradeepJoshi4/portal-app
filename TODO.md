# TODO List for Implementing localStorage Token, User Name Display, and App Bar Beautification

- [x] Modify login API (`src/app/api/auth/login/route.ts`) to return user data (name, email) along with token.
- [x] Update login page (`src/app/login/page.tsx`) to store token and user name in localStorage on successful login.
- [x] Update dashboard page (`src/app/dashboard/page.tsx`) to:
  - Add client-side auth check using localStorage token (redirect to login if missing).
  - Retrieve and display user name in the app bar.
  - Beautify app bar with gradient background, user icon/avatar, better spacing, and responsive design.
- [x] Update logout API (`src/app/api/auth/logout/route.ts`) to handle localStorage clearing (client-side).
- [x] Adjust middleware (`src/middleware.ts`) to comment out cookie check since switching to localStorage.
- [ ] Test login flow: ensure token and name stored in localStorage.
- [ ] Test dashboard: user name displays, redirects if no token.
- [ ] Test logout: clears localStorage.
- [ ] Verify app bar styling.

# TODO List for Beautifying Login, Signup Pages and Dashboard Navbar

- [x] Beautify login page (`src/app/login/page.tsx`): Add gradient background, icons (Mail, Lock), enhance form inputs/buttons with hover effects and better styling.
- [x] Beautify signup page (`src/app/signup/page.tsx`): Add gradient background, icons (Mail, Lock), enhance form inputs/buttons with hover effects and better styling for consistency.
- [x] Enhance dashboard navbar (`src/app/dashboard/page.tsx`): Add LogOut icon from lucide-react to the logout button.
- [ ] Test the updated pages visually (run app and check login/signup forms and dashboard navbar).
