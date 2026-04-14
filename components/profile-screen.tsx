'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Instagram, Mail, Coffee } from 'lucide-react';
import Image from 'next/image';
import { STORE_INFO } from '@/lib/store-info';

export function ProfileScreen() {
  return (
    <motion.main
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 overflow-y-auto pb-[calc(8.75rem+env(safe-area-inset-bottom))] md:pb-40 bg-background"
    >
      {/* Header con logo */}
      <div className="bg-gradient-to-b from-primary to-primary/90 px-6 py-7 text-white text-center max-md:py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3"
        >
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-lg max-md:w-16 max-md:h-16">
            <Image
              src="/logo-tostadero.jpg"
              alt={STORE_INFO.name}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-serif text-2xl font-bold mb-0.5 max-md:text-xl">{STORE_INFO.shortName}</h1>
          <p className="text-base tracking-wider font-medium max-md:text-sm">{STORE_INFO.displayName}</p>
        </motion.div>
      </div>

      {/* Contenido */}
      <div className="px-6 py-6 space-y-6">
        {/* Descripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-primary/70 leading-relaxed">
            {STORE_INFO.description}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Ubicación */}
          <div className="bg-primary/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Ubicación</p>
              <p className="text-primary/70 text-sm">{STORE_INFO.address.street}</p>
              <p className="text-primary/70 text-sm">
                {STORE_INFO.address.city}, {STORE_INFO.address.country}
              </p>
            </div>
          </div>

          {/* Horarios */}
          <div className="bg-primary/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Horarios</p>
              {STORE_INFO.hours.map((item) => (
                <p key={item.label} className="text-primary/70 text-sm">
                  {item.label}: {item.hours}
                </p>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-primary/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Contacto</p>
              <a href={`tel:${STORE_INFO.contact.phone.replace(/\s+/g, '')}`} className="block text-primary/70 text-sm hover:text-primary">
                {STORE_INFO.contact.phone}
              </a>
              <a href={`mailto:${STORE_INFO.contact.email}`} className="block text-primary/70 text-sm hover:text-primary">
                {STORE_INFO.contact.email}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Redes Sociales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 pt-4"
        >
          <a
            href={STORE_INFO.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
            aria-label="Abrir Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${STORE_INFO.contact.email}`}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
            aria-label="Enviar email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href={`tel:${STORE_INFO.contact.phone.replace(/\s+/g, '')}`}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
            aria-label="Llamar al local"
          >
            <Coffee className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-primary/40 pt-4"
        >
          {STORE_INFO.name} · {STORE_INFO.tagline}
        </motion.p>
      </div>
    </motion.main>
  );
}
