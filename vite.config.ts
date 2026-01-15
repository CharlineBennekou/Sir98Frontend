import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
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
        name: 'Sir 98',
        short_name: 'Sir 98',
        description: "Kalender over Sir 98's hold og begivenheder",
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
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
