import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import CelebratePage from "./pages/CelebratePage";
import MessagePage from "./pages/MessagePage";
import GiftsPage from "./pages/GiftsPage";
import MemoriesPage from "./pages/MemoriesPage";
import GuestbookPage from "./pages/GuestbookPage";
import SurprisePage from "./pages/SurprisePage";
import NotFound from "./pages/NotFound";
import PageTransition, { TransitionOverlay } from "./components/PageTransition";
import MiniMusicPlayer, { MusicProvider } from "./components/MiniMusicPlayer";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <>
      <TransitionOverlay />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/celebrate" element={<CelebratePage />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/gifts" element={<GiftsPage />} />
            <Route path="/memories" element={<MemoriesPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/surprise" element={<SurprisePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      <MiniMusicPlayer />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
