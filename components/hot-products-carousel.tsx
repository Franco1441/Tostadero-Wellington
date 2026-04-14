"use client";

import { motion } from 'framer-motion';
import { menuItems } from '@/lib/menu-data';
import { ProductCard } from './product-card';

export function HotProductsCarousel() {
  const hotItems = menuItems.filter(
    (item) =>
      item.imagePath &&
      ['cafe', 'con-leche', 'sin-cafe'].includes(item.category),
  );

  if (hotItems.length === 0) return null;

  return (
    <section className="px-10 py-3 max-md:px-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mb-3 flex items-center gap-2"
      >
        <h2 className="font-bold text-xs uppercase tracking-widest text-primary/50">Destacados calientes</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        className="flex items-center overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-10 px-10 max-md:-mx-5 max-md:px-5 py-3"
      >
        {hotItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + index * 0.04 }}
            className="flex-shrink-0"
          >
            <ProductCard item={item} />
          </motion.div>
        ))}

        <div className="min-w-[8px] flex-shrink-0" />
      </motion.div>
    </section>
  );
}
