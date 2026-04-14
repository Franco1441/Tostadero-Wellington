import { motion } from 'framer-motion';
import { categories, type Category } from '@/lib/menu-data';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { STORE_INFO, getAddressLines, getCompactHours } from '@/lib/store-info';

interface SidebarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside
      className="w-[280px] bg-gradient-to-b from-primary to-primary/95 text-primary-foreground p-8 pb-32 flex flex-col justify-between transition-all duration-300 max-md:hidden shadow-xl h-screen overflow-y-auto"
      style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom, 8rem))' }}
    >
      <div>
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-left mb-12 leading-[0.85]"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white/30">
            <Image
              src="/logo-tostadero.jpg"
              alt={STORE_INFO.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <span className="font-serif text-3xl block font-bold" style={{ fontSize: '30px', lineHeight: '1', marginBottom: '0px' }}>{STORE_INFO.shortName}</span>
          <span className="text-sm font-bold" style={{ fontWeight: '900', fontSize: '18px', lineHeight: '1', letterSpacing: '0.05em' }}>{STORE_INFO.displayName}</span>
          <p className="text-xs opacity-70 mt-2">{STORE_INFO.tagline}</p>
        </motion.div>

        {/* Divider */}
        <div className="mb-8 h-px bg-white/10" />

        {/* Categories */}
        <ul className="space-y-2">
          {categories.map((cat, index) => (
            <li key={cat.id}>
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(cat.id as Category)}
                aria-pressed={activeCategory === cat.id}
                className={`
                  w-full text-left text-sm cursor-pointer transition-all duration-300 py-3 px-5 rounded-full font-medium
                  ${activeCategory === cat.id 
                    ? 'bg-white/18 font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' 
                    : 'opacity-70 hover:opacity-95 hover:bg-white/10'
                  }
                `}
              >
                {cat.label}
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="h-px bg-white/10" />
        
        <div className="flex items-center gap-2 text-sm opacity-80">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="whitespace-pre-line">{getAddressLines().join('\n')}</span>
        </div>

        <div className="rounded-2xl bg-white/6 p-4 text-xs opacity-70">
          <p className="font-semibold mb-1">Horario</p>
          <p className="leading-5">{getCompactHours()}</p>
        </div>
      </motion.div>

      {/* Spacer to avoid overlap with fixed bottom nav */}
      <div style={{ height: 'max(8rem, env(safe-area-inset-bottom, 8rem))' }} />
    </aside>
  );
}
