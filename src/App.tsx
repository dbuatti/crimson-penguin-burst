import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateHabit from "./pages/CreateHabit";
import EditHabit from "./pages/EditHabit";
import HabitCalendar from "./pages/HabitCalendar";
import ArchivedHabits from "./pages/ArchivedHabits";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { SessionContextProvider } from "./components/SessionContextProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout"; // Import the new Layout component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SessionContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}> {/* Wrap main routes with Layout */}
              <Route path="/" element={<Index />} />
              <Route path="/create-habit" element={<CreateHabit />} />
              <Route path="/edit-habit/:id" element={<EditHabit />} />
              <Route path="/habit-calendar/:id" element={<HabitCalendar />} />
              <Route path="/archived-habits" element={<ArchivedHabits />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;