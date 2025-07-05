
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import EventRegister from "./pages/EventRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventCreate from "./pages/admin/AdminEventCreate";
import AdminEventEdit from "./pages/admin/AdminEventEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create a simple auth context
type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/event/register/:id" element={
                <ProtectedRoute>
                  <EventRegister />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/events/create" element={
                <ProtectedRoute>
                  <AdminEventCreate />
                </ProtectedRoute>
              } />
              <Route path="/admin/events/edit/:id" element={
                <ProtectedRoute>
                  <AdminEventEdit />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
