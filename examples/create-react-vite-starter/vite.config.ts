import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose LEGIT_* env vars to the browser bundle too (default is only VITE_*).
  // Note: anything exposed here is not a secret in a frontend app.
  envPrefix: ['LEGIT_'],
})
