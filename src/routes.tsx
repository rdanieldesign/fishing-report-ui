import { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { SideNav } from './components/layout/SideNav';
import { RequireAuth } from './components/auth/RequireAuth';
import { RedirectIfAuth } from './components/auth/RedirectIfAuth';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { EntryListPage } from './pages/EntryListPage';
import { EntryCreatePage } from './pages/EntryCreatePage';
import { EntryEditPage } from './pages/EntryEditPage';
import { EntryDetailPage } from './pages/EntryDetailPage';
import { FriendsListPage } from './pages/FriendsListPage';
import { FriendsAddPage } from './pages/FriendsAddPage';

// Layout route: renders Header + SideNav shell, then the matched child via <Outlet>.
// Login and Signup sit outside this so they render without the shell.
// useState here lifts sidenav open/close state so Header and SideNav can share it
// without prop drilling through unrelated route components.
function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setNavOpen((o) => !o)} />
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="flex-1 p-6 overflow-auto">
        {/* <Outlet> renders the currently matched child route */}
        <Outlet />
      </main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth pages — no shell, bounce to /entries if already logged in */}
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* App shell — all protected routes nested inside RequireAuth then AppLayout */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          {/* Entry routes */}
          <Route path="/entries" element={<EntryListPage />} />
          <Route path="/entries/create" element={<EntryCreatePage />} />
          <Route path="/entries/:entryId" element={<EntryDetailPage />} />
          <Route path="/entries/:entryId/edit" element={<EntryEditPage />} />

          {/* Polymorphic entry list variants — same component, different data source */}
          <Route path="/my-entries" element={<EntryListPage />} />
          <Route path="/users/:userId/entries" element={<EntryListPage />} />
          <Route path="/locations/:locationId/entries" element={<EntryListPage />} />

          {/* Friends routes */}
          <Route path="/friends" element={<Navigate to="/friends/list" replace />} />
          <Route path="/friends/list" element={<FriendsListPage />} />
          <Route path="/friends/add" element={<FriendsAddPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
