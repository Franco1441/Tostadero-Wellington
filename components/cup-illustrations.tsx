'use client';

// Ilustraciones de tazas estilo hand-drawn con líneas azules
// Estilo sketch/doodle minimalista

interface CupProps {
  className?: string;
}

// Taza base con steam - para cafés calientes simples
export function CupWithSteam({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Steam lines */}
      <path
        d="M35 25 Q40 15, 35 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 20 Q55 10, 50 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M65 25 Q70 15, 65 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup body - hand drawn style with wobbly lines */}
      <path
        d="M20 40 L25 120 Q50 130, 75 120 L80 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="40"
        rx="32"
        ry="8"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Coffee surface line */}
      <path
        d="M25 55 Q50 60, 75 55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
      />
      
      {/* Handle */}
      <path
        d="M80 50 Q100 55, 100 75 Q100 95, 80 100"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Taza con 3 capas - para Blanco & Naranja / Pistacho
export function CupThreeLayers({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Cup body */}
      <path
        d="M22 35 L28 115 Q50 125, 72 115 L78 35"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="35"
        rx="30"
        ry="7"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Layer 1 - Top (coffee) */}
      <path
        d="M24 50 Q50 55, 76 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Layer 2 - Middle (milk) */}
      <path
        d="M26 75 Q50 80, 74 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Layer 3 - Bottom line */}
      <path
        d="M27 95 Q50 100, 73 95"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Small dots/texture in top layer */}
      <circle cx="40" cy="60" r="1.5" fill="currentColor" />
      <circle cx="55" cy="58" r="1.5" fill="currentColor" />
      <circle cx="62" cy="62" r="1.5" fill="currentColor" />
      
      {/* Handle */}
      <path
        d="M78 45 Q98 50, 98 70 Q98 90, 78 95"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Taza con burbujas - para Café Tonic
export function CupWithBubbles({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Cup body */}
      <path
        d="M22 35 L28 115 Q50 125, 72 115 L78 35"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="35"
        rx="30"
        ry="7"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Divider line - half coffee half tonic */}
      <path
        d="M25 70 Q50 75, 75 70"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Bubbles in bottom half (tonic) */}
      <circle cx="35" cy="85" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="95" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="65" cy="88" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="100" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="58" cy="105" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="90" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Small dots in coffee part */}
      <circle cx="40" cy="50" r="1.5" fill="currentColor" />
      <circle cx="55" cy="55" r="1.5" fill="currentColor" />
      <circle cx="60" cy="48" r="1.5" fill="currentColor" />
      
      {/* Handle */}
      <path
        d="M78 45 Q98 50, 98 70 Q98 90, 78 95"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Taza con hielo - para Cold Brew / Iced Latte
export function CupWithIce({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Tall glass body */}
      <path
        d="M25 30 L30 120 Q50 128, 70 120 L75 30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Glass rim */}
      <ellipse
        cx="50"
        cy="30"
        rx="27"
        ry="6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Ice cubes - simple rectangles */}
      <rect x="35" y="45" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="52" y="50" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="38" y="65" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="55" y="70" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Liquid level */}
      <path
        d="M28 85 Q50 90, 72 85"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="5 3"
      />
      
      {/* Straw */}
      <line x1="58" y1="15" x2="62" y2="100" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Taza pequeña - para Espresso
export function SmallCup({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Steam */}
      <path
        d="M45 45 Q50 35, 45 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 40 Q60 30, 55 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Small cup body */}
      <path
        d="M30 55 L35 100 Q50 108, 65 100 L70 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="55"
        rx="22"
        ry="5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Crema line */}
      <path
        d="M33 65 Q50 68, 67 65"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Handle */}
      <path
        d="M70 60 Q85 65, 85 78 Q85 90, 70 95"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Saucer */}
      <ellipse
        cx="50"
        cy="115"
        rx="35"
        ry="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M20 115 Q50 108, 80 115"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

// Taza con foam/espuma - para Cappuccino
export function CupWithFoam({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Steam */}
      <path
        d="M35 20 Q40 10, 35 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 15 Q60 5, 55 -5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup body */}
      <path
        d="M20 40 L26 115 Q50 125, 74 115 L80 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="40"
        rx="32"
        ry="8"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Foam bubbles on top */}
      <circle cx="35" cy="48" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="45" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="57" cy="47" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="65" cy="50" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="52" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="52" cy="53" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Latte art heart */}
      <path
        d="M45 60 Q42 55, 47 55 Q50 55, 50 58 Q50 55, 53 55 Q58 55, 55 60 L50 68 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Handle */}
      <path
        d="M80 50 Q100 55, 100 75 Q100 95, 80 100"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Taza con chocolate - para Mocha
export function CupMocha({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className}>
      {/* Steam */}
      <path
        d="M40 22 Q45 12, 40 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 18 Q60 8, 55 -2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup body */}
      <path
        d="M20 38 L26 115 Q50 125, 74 115 L80 38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="50"
        cy="38"
        rx="32"
        ry="8"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Whipped cream swirl on top */}
      <path
        d="M40 35 Q45 28, 50 35 Q55 28, 60 35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M45 30 Q50 23, 55 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Chocolate drizzle lines */}
      <path
        d="M35 55 L38 80"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M50 52 L52 85"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M65 55 L62 75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      
      {/* Handle */}
      <path
        d="M80 48 Q100 53, 100 73 Q100 93, 80 98"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Medialuna / Croissant
export function Croissant({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 100" fill="none" className={className}>
      {/* Main croissant shape */}
      <path
        d="M15 60 Q30 35, 60 30 Q90 35, 105 60 Q90 70, 60 75 Q30 70, 15 60"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Inner curves for layers */}
      <path
        d="M25 58 Q45 45, 60 42 Q75 45, 95 58"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M35 55 Q50 48, 60 47 Q70 48, 85 55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Layer lines */}
      <path d="M30 62 Q35 58, 40 62" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M45 60 Q50 56, 55 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M60 58 Q65 54, 70 58" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M75 60 Q80 56, 85 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Cookie
export function Cookie({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      {/* Cookie circle - slightly irregular */}
      <path
        d="M60 15 Q90 18, 100 50 Q102 80, 70 100 Q40 105, 20 75 Q15 45, 40 22 Q55 12, 60 15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Chocolate chips */}
      <ellipse cx="45" cy="40" rx="6" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="70" cy="45" rx="5" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="55" cy="65" rx="6" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="75" cy="70" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="40" cy="75" rx="4" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="60" cy="85" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Roll de Canela
export function CinnamonRoll({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      {/* Spiral shape */}
      <path
        d="M60 60 Q60 45, 75 45 Q90 45, 90 60 Q90 75, 75 80 Q55 85, 45 75 Q30 65, 35 50 Q40 35, 60 32 Q85 30, 95 50 Q105 75, 85 95 Q60 110, 35 95 Q15 80, 20 55 Q25 30, 55 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Frosting drizzle on top */}
      <path
        d="M50 50 Q55 45, 60 52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M65 55 Q70 50, 75 58"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Chipa
export function Chipa({ className = '' }: CupProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      {/* Round bread shape - irregular */}
      <ellipse
        cx="60"
        cy="60"
        rx="38"
        ry="35"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Crack on top */}
      <path
        d="M45 45 Q60 40, 75 45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Texture lines */}
      <path
        d="M35 55 Q40 52, 45 55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70 52 Q75 49, 80 52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 70 Q55 67, 60 70"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Mapa de producto a ilustración
export function getIllustration(productId: string) {
  const illustrations: Record<string, React.ComponentType<CupProps>> = {
    // Cafes frios
    'naranja-latte': CupThreeLayers,
    'pistacho-latte': CupThreeLayers,
    'espresso-tonic': CupWithBubbles,
    'aerocano': CupWithIce,
    'latte-frio': CupWithIce,
    // Cafes calientes
    'flat-white': CupWithSteam,
    'latte': CupWithFoam,
    'cappuccino': CupWithFoam,
    'espresso': SmallCup,
    'cortado': SmallCup,
    'americano': CupWithSteam,
    'submarino': CupMocha,
    // Comida
    'medialuna-pucue': Croissant,
    'windy-deluxe': Croissant,
    'welly-supreme': Croissant,
    'roll-canela': CinnamonRoll,
    'cookies': Cookie,
    'cookies-saludables': Cookie,
    'budin-banana': Cookie,
    'danesas': Croissant,
    'monitos': Croissant,
  };

  return illustrations[productId] || CupWithSteam;
}
