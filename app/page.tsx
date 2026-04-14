'use client';

import { useState } from 'react';
import { LoadingScreen } from '@/components/loading-screen';
import { WelcomeScreen } from '@/components/welcome-screen';
import { Sidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content';
import { BottomNav } from '@/components/bottom-nav';
import { CartSidebar } from '@/components/cart-sidebar';
import { HomeScreen } from '@/components/home-screen';
import { useCartStore } from '@/lib/cart-store';
import type { Category } from '@/lib/menu-data';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'home' | 'menu';
type ExperienceMode = 'browse' | 'takeaway';

export default function Home() {
  const { openCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('cafe');
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const canOrder = experienceMode === 'takeaway';

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleWelcomeSelection = (mode: ExperienceMode) => {
    setExperienceMode(mode);
    setActiveTab('menu');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleSidebarCategorySelect = (category: Category) => {
    setActiveCategory(category);
    setActiveTab('menu');
  };

  const handleHomeCategorySelect = (category: Category) => {
    setActiveCategory(category);
    setActiveTab('menu');
  };

  // Show loading screen first
  // Render the app content underneath and show the loading overlay when active.
  return (
    <div className="relative">
      <motion.div
        initial={isLoading ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-screen overflow-hidden bg-background"
      >
      {/* If the welcome screen should be shown, render it as the main content.
          Otherwise render the regular app layout (sidebar, main content, etc.) */}
      {!experienceMode ? (
        <AnimatePresence mode="wait">
          <WelcomeScreen key="initial-welcome" onSelectMode={handleWelcomeSelection} />
        </AnimatePresence>
      ) : (
        <>
          {/* Desktop Sidebar */}
          <Sidebar 
            activeCategory={activeCategory} 
            onCategoryChange={handleSidebarCategorySelect} 
          />

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'menu' && (
              <MainContent 
                key="menu"
                activeCategory={activeCategory}
                onCategoryChange={handleSidebarCategorySelect}
                canOrder={canOrder}
              />
            )}
            
            {activeTab === 'home' && (
              <HomeScreen 
                key="home"
                onSelectCategory={handleHomeCategorySelect}
                onOpenCart={openCart}
                canOrder={canOrder}
              />
            )}
          </AnimatePresence>

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} canOrder={canOrder} />

          {/* Cart Sidebar */}
          {canOrder ? <CartSidebar /> : null}
        </>
      )}
      </motion.div>

      {/* Loader overlay kept mounted on top to avoid a white flash when unmounting */}
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" onComplete={handleLoadingComplete} />}
      </AnimatePresence>
    </div>
  );
}
