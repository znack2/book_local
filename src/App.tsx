
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { stackClientApp } from "./stack";
import { AuthProvider } from "./contexts/AuthContext";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import Videos from "./pages/Videos";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Questionnaire from "./pages/QuestionnairePage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function HandlerRoutes() {
  const location = useLocation();
  
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={null}>
          <BrowserRouter>
            <StackProvider app={stackClientApp}>
              <StackTheme>
                <AuthProvider>
                  <Routes>
                    <Route path="/handler/*" element={<HandlerRoutes />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Gallery />
                      </ProtectedRoute>
                    } />
                    <Route path="/questionnaire" element={
                      <ProtectedRoute>
                        <Questionnaire />
                      </ProtectedRoute>
                    } />                    
                    <Route path="/articles" element={
                      <ProtectedRoute>
                        <Articles />
                      </ProtectedRoute>
                    } />
                    <Route path="/videos" element={
                      <ProtectedRoute>
                        <Videos />
                      </ProtectedRoute>
                    } />
                    <Route path="/canvas" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </AuthProvider>
              </StackTheme>
            </StackProvider>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
