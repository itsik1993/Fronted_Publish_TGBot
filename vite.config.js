import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  
  // server: {
  //   allowedHosts: ['https://stones-scanners-holdings-prints.trycloudflare.com']

  // }
      server: {
    allowedHosts: true, // זה יאשר אוטומטית כל כתובת trycloudflare.com שתקבל
    host: true,         // מאפשר גישה מרשתות חיצוניות
    strictPort: true    // שומר על פורט 5173 ולא עובר לפורט אחר
  }
})
