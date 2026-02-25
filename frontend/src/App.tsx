import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminPortfolioPage from './pages/AdminPortfolioPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

// Named root component so React hooks rules are satisfied
function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Outlet />
      <ProfileSetupModal open={showProfileSetup} />
      <Toaster />
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Layout route wrapping all pages
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

// Page routes
const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const blogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/blog',
  component: BlogListingPage,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/blog/$id',
  component: BlogDetailPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/portfolio',
  component: PortfolioPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/about',
  component: AboutPage,
});

const adminBlogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/admin/blog',
  component: AdminBlogPage,
});

const adminPortfolioRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/admin/portfolio',
  component: AdminPortfolioPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    blogRoute,
    blogDetailRoute,
    portfolioRoute,
    aboutRoute,
    adminBlogRoute,
    adminPortfolioRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
