'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { STORE_INFO } from '@/lib/store-info';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onSelectMode: (mode: 'browse' | 'takeaway') => void;
}

const OPTIONS = [
  {
    id: 'browse',
    title: 'Solo ver la carta',
    description: 'Explorá el menú y después pedí y pagá en caja.',
    icon: Eye,
    featured: false,
  },
  {
    id: 'takeaway',
    title: 'Pedir take away',
    description: 'Armá tu pedido acá y pagalo directo desde la app.',
    icon: ShoppingBag,
    featured: true,
  },
] as const;

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-primary text-white"
    >
      <div
        className="relative mx-auto grid h-[100dvh] max-h-[100dvh] w-full max-w-[24rem] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-5 md:max-w-[28rem] md:px-8"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="relative pt-2 text-left"
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/54 md:text-xs">
            Bienvenido a
          </p>
          <div className="mt-2.5 leading-[0.92] md:mt-3.5">
            <p className="font-serif text-[3.05rem] tracking-[-0.02em] text-white md:text-[4.4rem]">
              {STORE_INFO.shortName}
            </p>
            <p className="mt-1 block text-[2.05rem] font-black uppercase tracking-[0.05em] text-white md:text-[2.65rem]">
              {STORE_INFO.displayName}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 120, damping: 16 }}
          className="relative flex min-h-0 items-center justify-center overflow-hidden py-1 md:py-4"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.2, ease: 'easeInOut', repeat: Infinity }}
            className="relative"
          >
            <Image
              src="/cafe-bienvenida.png"
              alt={`Ilustración de ${STORE_INFO.name}`}
              width={320}
              height={360}
              priority
              className="h-auto max-h-[23svh] w-full max-w-[11.5rem] object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.18)] md:max-h-[36svh] md:max-w-[18rem]"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
          className="relative shrink-0 pt-1"
        >
          <div className="grid gap-2.5 md:min-w-[360px]">
            {OPTIONS.map(({ id, title, description, icon: Icon, featured }) => (
              <motion.button
                key={id}
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelectMode(id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[24px] border px-4 py-3 text-left backdrop-blur-sm transition-all md:gap-4 md:px-5 md:py-4',
                  featured
                    ? 'border-white/34 bg-white text-primary shadow-[0_18px_34px_rgba(0,0,0,0.16)]'
                    : 'border-white/18 bg-white/10 text-white hover:bg-white/14',
                )}
                aria-label={title}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12',
                    featured ? 'bg-primary text-white' : 'bg-white/12 text-white',
                  )}
                >
                  <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-[0.97rem] font-semibold md:text-base',
                      featured ? 'text-primary' : 'text-white',
                    )}
                  >
                    {title}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-[0.82rem] leading-snug md:text-sm',
                      featured ? 'text-primary/68' : 'text-white/70',
                    )}
                  >
                    {description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
