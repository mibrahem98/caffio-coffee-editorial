import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
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
const PaymentActivity = lazy(() => import("./pages/PaymentActivity"));
const ProductSearch = lazy(() => import("./pages/ProductSearch"));
const Sources = lazy(() => import("./pages/Sources"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));
const TastingModeration = lazy(() => import("./pages/TastingModeration"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoader() {
  return <main className="route-loader" aria-busy="true" aria-live="polite" aria-label="Loading Caffio page"><div className="route-loader-seal" aria-hidden="true"><span className="mizan-symbol"><i /><b /><em /></span></div><div><small>CAFFIO COFFEE</small><p>Loading the next record</p></div></main>;
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
      <Route path={"/payments"} component={PaymentActivity} />
      <Route path={"/search"} component={ProductSearch} />
      <Route path={"/sources"} component={Sources} />
      <Route path={"/compare"} component={ProductComparison} />
      <Route path={"/admin/tasting"} component={TastingModeration} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function RouteTransition() {
  const [location] = useLocation();
  return <div className="route-transition" key={location}><Router /></div>;
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
                <RouteTransition />
              </Suspense>
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
