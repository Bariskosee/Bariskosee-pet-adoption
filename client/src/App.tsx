import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import PetsPage from "@/pages/PetsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AdoptionsPage from "@/pages/AdoptionsPage";
import AddUserPage from "@/pages/AdduserPage";
import { AuthProvider } from "@/hooks/useAuth";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/" component={DashboardPage} />
      <Route path="/pets" component={PetsPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/adoptions" component={AdoptionsPage} />
      <Route path="/add-user" component={AddUserPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
