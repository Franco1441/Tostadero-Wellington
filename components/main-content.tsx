'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { menuItems, categories, type Category } from '@/lib/menu-data';
import { ProductCard } from './product-card';
import { STORE_INFO } from '@/lib/store-info';
import { cn } from '@/lib/utils';

interface MainContentProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  canOrder: boolean;
}

export function MainContent({ activeCategory, onCategoryChange, canOrder }: MainContentProps) {
  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="relative flex-1 overflow-y-auto bg-gradient-to-b from-primary/5 to-transparent">

      {/* Header mobile compacto */}
      <div className="sticky top-0 z-30 px-4 pt-3 max-[430px]:px-3 md:hidden">
        <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white/88 shadow-[0_18px_40px_rgba(12,76,161,0.12)] backdrop-blur supports-[backdrop-filter]:bg-white/82">
          <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full border border-primary/10 shadow-[0_10px_20px_rgba(12,76,161,0.08)]">
                <Image
                  src="/logo-tostadero.jpg"
                  alt={STORE_INFO.name}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-primary">{STORE_INFO.name}</p>
                <span className="mt-1 block text-[11px] text-primary/48">{STORE_INFO.tagline}</span>
              </div>
            </div>
            <div className={cn(
              'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
              canOrder ? 'bg-primary text-white' : 'bg-primary/8 text-primary/65',
            )}>
              {canOrder ? 'Take away' : 'Solo carta'}
            </div>
          </header>

          <div className="border-t border-primary/8 pb-3 pt-3">
            <div className="-mx-3 overflow-x-auto px-3 scrollbar-hide">
              <div className="flex min-w-full w-max gap-2 pr-4">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategoryChange(cat.id as Category)}
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200',
                      activeCategory === cat.id
                        ? 'bg-primary text-white shadow-[0_10px_20px_rgba(12,76,161,0.22)]'
                        : 'bg-primary/5 text-primary/62 hover:bg-primary/8',
                    )}
                  >
                    {cat.label}
                  </motion.button>
                ))}
                <div aria-hidden className="w-1 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Titulo — solo en desktop */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden px-10 py-6 md:block"
      >
        <h1 className="text-[2.2rem] leading-tight" style={{ fontWeight: '500', color: 'rgb(12, 76, 161)' }}>
          {STORE_INFO.heroKicker}
        </h1>
        <span className="font-serif text-[3.5rem] block leading-tight text-primary">
          {STORE_INFO.name}
        </span>
      </motion.div>

      {/* Pills de categoria — mobile */}
      <div className="hidden overflow-x-auto gap-2 px-5 py-3 snap-x snap-mandatory scrollbar-hide md:flex">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(cat.id as Category)}
            className={`
              px-4 py-2 rounded-full text-xs whitespace-nowrap snap-start flex-shrink-0
              cursor-pointer transition-all duration-200 font-semibold
              ${activeCategory === cat.id 
                ? 'bg-primary text-white shadow-md shadow-primary/25' 
                : 'bg-white text-primary border border-primary/20'
              }
            `}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Etiqueta de seccion */}
      <motion.div 
        key={activeCategory}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between px-10 pb-2 pt-5 text-xs font-bold uppercase tracking-widest text-primary/50 max-md:px-5 max-md:pt-5 max-[430px]:px-4"
      >
        <span>{categories.find((c) => c.id === activeCategory)?.fullLabel}</span>
        <span className="font-medium tracking-[0.14em] text-primary/35 md:hidden">
          Deslizá hacia abajo
        </span>
      </motion.div>

      {/* Productos desktop */}
      <motion.div 
        key={`products-desktop-${activeCategory}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden gap-5 overflow-x-auto px-10 pb-40 pt-3 scrollbar-hide md:flex"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, type: 'spring', stiffness: 200 }}
            className="py-2 flex-shrink-0"
          >
            <ProductCard item={item} canOrder={canOrder} />
          </motion.div>
        ))}
        <div className="min-w-[16px] flex-shrink-0" />
      </motion.div>

      {/* Productos mobile */}
      <motion.section
        key={`products-mobile-${activeCategory}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'grid grid-cols-2 gap-3 px-5 pt-3 max-[430px]:px-4 md:hidden',
          canOrder
            ? 'pb-[calc(11rem+env(safe-area-inset-bottom))]'
            : 'pb-[calc(7.5rem+env(safe-area-inset-bottom))]',
        )}
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 220 }}
          >
            <ProductCard item={item} canOrder={canOrder} />
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
