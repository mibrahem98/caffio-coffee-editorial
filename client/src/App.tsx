import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import OrderTracking from "./pages/OrderTracking";
import FieldNotes from "./pages/FieldNotes";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import ScrollMotion from "./components/ScrollMotion";
import CaseStudy from "./pages/CaseStudy";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/coffee/:id"} component={ProductDetail} />
      <Route path={"/track"} component={OrderTracking} />
      <Route path={"/notes"} component={FieldNotes} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/case-study"} component={CaseStudy} />
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
              <Router />
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
