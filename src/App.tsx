import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateHabit from "./pages/CreateHabit";
import EditHabit from "./pages/EditHabit";
import HabitCalendar from "./pages/HabitCalendar";
import ArchivedHabits from "./pages/ArchivedHabits";
import History from "./pages/History"; // Import the new History page
import Login from "./pages/Login";
import { SessionContextProvider } from "./components/SessionContextProvider";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      {/* Removed shadcn/ui Toaster, using Sonner exclusively */}
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SessionContextProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-habit" element={<CreateHabit />} />
            <Route path="/edit-habit/:id" element={<EditHabit />} />
            <Route path="/habit-calendar/:id" element={<HabitCalendar />} />
            <Route path="/archived-habits" element={<ArchivedHabits />} />
            <Route path="/history" element={<History />} /> {/* Add the new History route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;