
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewAssessment from "./pages/NewAssessment";
import { AuthProvider } from '@/contexts/AuthContext';
import { AssessmentProvider } from '@/contexts/AssessmentContext';  // Add this import
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import TrendsComponent from "./components/TrendsComponent";
import History from "./components/History"; // Update to match the new file name casing

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AssessmentProvider>  {/* Add this wrapper */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <NewAssessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trends"
                element={
                  <ProtectedRoute>
                    <TrendsComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />  {/* Changed from HistoryComponent */}
                  </ProtectedRoute>
                }
              />
              {/* Wrap other routes with ProtectedRoute similarly */}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AssessmentProvider>  {/* Close the wrapper */}
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
