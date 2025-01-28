// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuración para Playwright en Vercel
  experimental: {
    serverComponentsExternalPackages: ['playwright-core'],
  },
  webpack: (config) => {
    // Añadir configuración necesaria para Playwright
    config.externals.push({ playwright: 'commonjs playwright' });
    
    // Si tienes otras configuraciones webpack, mantenlas aquí
    
    return config;
  }
};

export default nextConfig;