import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Просто жёстко указываем base только для build
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/bloggerPlatform-front/' : '/', // 💡 Vite сам передаст command
}))
