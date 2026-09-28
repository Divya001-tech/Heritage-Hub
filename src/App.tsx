import React from 'react';
import { useCultureStore } from './store/useCultureStore';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedStories } from './components/home/FeaturedStories';
import { CategoriesGrid } from './components/home/CategoriesGrid';
import { StatsSection } from './components/home/StatsSection';
import { TimelineSection } from './components/home/TimelineSection';
import { ContributorSpotlight } from './components/home/ContributorSpotlight';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { CallToActionSection } from './components/home/CallToActionSection';
import { CultureMap } from './components/map/CultureMap';
import { DiscoveryView } from './components/discovery/DiscoveryView';
import { ContributePortal } from './components/contribute/ContributePortal';
import { ModeratorDashboard } from './components/moderation/ModeratorDashboard';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { CultureDetailModal } from './components/detail/CultureDetailModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { FloatingAudioPlayer } from './components/audio/FloatingAudioPlayer';
import { SupabaseDeploymentGuide } from './components/docs/SupabaseDeploymentGuide';
import { CorePillarsSection } from './components/home/CorePillarsSection';
import { ArrowRight, MapPin } from 'lucide-react';

export default function App() {
  const { currentView, setView, isDarkMode } = useCultureStore();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] dark:bg-[#12100E] text-[#181512] dark:text-[#F6F3ED] transition-colors duration-200">
      
      {/* Universal Top Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* 1. Hero Section with Typewriter & Interactive Landmarks */}
            <HeroSection />

            {/* 2. Core Pillars Architecture (Community-Powered, Digital Archive, Interactive Map, Easy Search, Beyond Preservation) */}
            <CorePillarsSection />

            {/* 3. Interactive India Map Section */}
            <section className="py-20 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-[#E8E1D3] dark:border-[#28231D] pb-6">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#C85A17] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Geospatial Heritage Cartography</span>
                    </div>
                    <h2 className="font-serif-display font-bold text-3xl sm:text-5xl text-[#181512] dark:text-[#F6F3ED] tracking-tight">
                      Explore Living Traditions on the Atlas
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] max-w-xl leading-relaxed">
                      Select any cultural region or district hotspot to discover local ballads, sacred invocations, and endangered dialects with smooth 0.8s transitions.
                    </p>
                  </div>

                  <button
                    onClick={() => setView('map')}
                    className="self-start md:self-auto px-6 py-3 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider text-white bg-[#C85A17] hover:bg-[#A8450A] transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-2"
                  >
                    <span>Full-Screen Cartography</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="rounded-3xl overflow-hidden border border-[#DFD7C7] dark:border-[#332C24] shadow-2xl h-[580px]">
                  <CultureMap />
                </div>
              </div>
            </section>

            {/* 3. Record and Preserve Heritage Priority Card */}
            <CallToActionSection />

            {/* 4. Featured Oral Traditions & Stories */}
            <FeaturedStories />

            {/* 5. Cultural Categories Grid */}
            <CategoriesGrid />

            {/* 6. Animated Count-Up Statistics */}
            <StatsSection />

            {/* 7. Timeline of Preservation */}
            <TimelineSection />

            {/* 8. Contributor Spotlight */}
            <ContributorSpotlight />

            {/* 9. Anthropological Testimonials */}
            <TestimonialsSection />
          </>
        )}

        {currentView === 'map' && <CultureMap />}
        {currentView === 'discover' && <DiscoveryView />}
        {currentView === 'contribute' && <ContributePortal />}
        {currentView === 'moderation' && <ModeratorDashboard />}
        {currentView === 'bookmarks' && <BookmarksView />}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Floating Audio Player (Persists across map exploration & reading) */}
      <FloatingAudioPlayer />

      {/* Deep-Dive Chronicle Modal */}
      <CultureDetailModal />

      {/* User Profile & Badges Modal */}
      <UserProfileModal />

      {/* Supabase & Vercel Architecture Modal */}
      <SupabaseDeploymentGuide />

    </div>
  );
}
