'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { MenuItem } from '@/lib/menu-data';
import { formatPrice } from '@/lib/menu-data';
import { useCartStore } from '@/lib/cart-store';
import { Check, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  item: MenuItem;
  canOrder?: boolean;
}

function AddToCartButton({
  justAdded,
  onClick,
  label,
  size = 20,
  className = '',
}: {
  justAdded: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={`flex items-center justify-center rounded-full text-white shadow-md transition-colors ${className} ${
        justAdded ? 'bg-green-500' : 'bg-primary hover:bg-primary/90'
      }`}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={size - 2} strokeWidth={3} />
          </motion.span>
        ) : (
          <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Plus size={size} strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function ProductCard({ item, canOrder = true }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isMobile = useIsMobile();

  const handleAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const hasImage = !!item.imagePath;
  const enableFlip = true;

  return (
    <motion.article
      className={cn(
        'perspective-1000 snap-center',
        enableFlip && 'cursor-pointer',
        hasImage
          ? 'h-[250px] w-full md:h-[280px] md:w-[200px]'
          : 'h-[220px] w-full md:h-[240px] md:w-[180px]',
      )}
      onClick={() => {
        if (enableFlip) {
          setIsFlipped((current) => !current);
        }
      }}
      whileHover={!isMobile ? { scale: 1.02 } : undefined}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: enableFlip && isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25, stiffness: 300 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRENTE */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] border border-primary/10 bg-[#f8f7f4] shadow-sm backface-hidden transition-shadow hover:shadow-lg">
          {hasImage ? (
            <>
              <div className="relative flex h-[138px] items-center justify-center bg-gradient-to-b from-white to-[#f8f7f4] p-3 pb-0 md:h-[170px] md:p-4 md:pb-0">
                {item.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-primary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary/60">
                    {item.badge}
                  </span>
                ) : null}
                <div className="relative h-full w-[72%]">
                  <Image
                    src={item.imagePath!}
                    alt={`${item.name} ${item.subtitle}`}
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="(max-width: 768px) 140px, 160px"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col bg-[#f8f7f4] p-3 pt-2 md:p-4 md:pt-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.15em] text-primary/50">
                      {item.name}
                    </p>
                    <h3 className="font-serif text-base font-bold leading-tight text-primary md:text-lg">
                      {item.subtitle}
                    </h3>
                    <p className="mt-1 font-serif text-lg font-bold text-primary md:text-xl">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  {canOrder ? (
                    <AddToCartButton
                      justAdded={justAdded}
                      onClick={handleAdd}
                      label={`Agregar ${item.name} ${item.subtitle}`}
                      size={18}
                      className="h-9 w-9 flex-shrink-0 md:h-10 md:w-10"
                    />
                  ) : null}
                </div>

                <div className="mt-auto pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/35">
                    Tocá para ver info
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col p-4 md:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/50">{item.name}</p>
              <h3 className="mt-1 font-serif text-xl font-bold leading-tight text-primary md:text-2xl">
                {item.subtitle}
              </h3>
              {item.badge ? (
                <span className="mt-3 inline-flex w-fit rounded-full bg-primary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary/60">
                  {item.badge}
                </span>
              ) : null}
              <div className="mt-auto flex items-end justify-between border-t border-primary/5 pt-3">
                <p className="font-serif text-xl font-bold text-primary md:text-2xl">
                  {formatPrice(item.price)}
                </p>
                {canOrder ? (
                  <AddToCartButton
                    justAdded={justAdded}
                    onClick={handleAdd}
                    label={`Agregar ${item.name} ${item.subtitle}`}
                    size={18}
                    className="h-9 w-9"
                  />
                ) : null}
              </div>
              <p className="pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/35">
                Tocá para ver info
              </p>
            </div>
          )}
        </div>

        {/* REVERSO */}
        {enableFlip ? (
          <div
            className="absolute inset-0 flex flex-col rounded-[20px] bg-primary p-5 shadow-lg backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="absolute right-3 top-3 rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            <div className="flex flex-1 flex-col justify-center">
              {hasImage && (
                <div className="relative mx-auto mb-3 h-16 w-16 opacity-25">
                  <Image src={item.imagePath!} alt="" fill className="object-contain" />
                </div>
              )}
              <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">{item.name}</p>
              <h3 className="mt-1 text-center font-serif text-xl font-bold text-white">{item.subtitle}</h3>
              <p className="mt-3 overflow-hidden text-center text-[11px] leading-relaxed text-white/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6]">
                {item.description || 'Preparado con los mejores granos de café de especialidad.'}
              </p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </motion.article>
  );
}
