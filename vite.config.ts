import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      //injectRegister: 'auto',             
      strategies: 'injectManifest',      

      
      srcDir: 'src',
      filename: 'sw.js',

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'SIR 98 information',
        short_name: 'SIR 98',
        id: "SIR98 app",
        scope: "/",
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: "portrait",
        lang: "da-DK",
        description: "SIR's hold og begivenheder",
        display: 'standalone',

        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      // Extra options for the injectManifest build (what to precache)
      injectManifest: {
     //   globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      injectionPoint: undefined
      },

      devOptions: {
        enabled: true,                   
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',  
                         
      },
    }),
    
  ],
  server: {
    host: true,              
    port: 5173,              
    // https: {
    //   key:  fs.readFileSync(path.resolve(__dirname, 'cert/192.168.8.15-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert/192.168.8.15.pem')),
    // },
  },
});
