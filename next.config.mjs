/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cambiá a false cuando subas a Vercel para optimización automática de imágenes
    unoptimized: true,
  },
  // Seguridad: headers HTTP básicos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
