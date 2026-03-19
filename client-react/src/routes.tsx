import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { SideNav } from './components/layout/SideNav';
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
function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6 overflow-auto">
          {/* <Outlet> renders the currently matched child route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth pages — no shell */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* App shell — all protected routes nested inside AppLayout */}
      <Route element={<AppLayout />}>
        {/* Entry routes */}
        <Route path="/entries" element={<EntryListPage />} />
        <Route path="/entries/create" element={<EntryCreatePage />} />
        <Route path="/entries/:entryId" element={<EntryDetailPage />} />
        {/* Edit is a child of detail in Angular: entries/:entryId/edit */}
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
    </Routes>
  );
}
