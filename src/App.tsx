import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateHabit from "./pages/CreateHabit";
import EditHabit from "./pages/EditHabit";
import HabitCalendar from "./pages/HabitCalendar";
import ArchivedHabits from "./pages/ArchivedHabits";
import Login from "./pages/Login"; // Import the new Login page
import { SessionContextProvider } from "./components/SessionContextProvider"; // Import the new SessionContextProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> {/* Added future flags */}
        <SessionContextProvider> {/* Wrap the entire app with SessionContextProvider */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} /> {/* Add the login route */}
            <Route path="/create-habit" element={<CreateHabit />} />
            <Route path="/edit-habit/:id" element={<EditHabit />} />
            <Route path="/habit-calendar/:id" element={<HabitCalendar />} />
            <Route path="/archived-habits" element={<ArchivedHabits />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;