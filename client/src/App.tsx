import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import ScrollMotion from "./components/ScrollMotion";

const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const FieldNotes = lazy(() => import("./pages/FieldNotes"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const CaffioSociety = lazy(() => import("./pages/CaffioSociety"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoader() {
  return <main className="route-loader" aria-busy="true" aria-live="polite"><span className="route-loader-mark" aria-hidden="true" /><p>Loading Caffio</p></main>;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/coffee/:id"} component={ProductDetail} />
      <Route path={"/track"} component={OrderTracking} />
      <Route path={"/notes"} component={FieldNotes} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/case-study"} component={CaseStudy} />
      <Route path={"/society"} component={CaffioSociety} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <CartProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <ScrollMotion />
              <Suspense fallback={<RouteLoader />}>
                <Router />
              </Suspense>
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
