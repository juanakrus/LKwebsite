import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        payment: resolve(__dirname, 'payment.html'),
        'custom-payment': resolve(__dirname, 'custom-payment.html'),
        'personalized-cake': resolve(__dirname, 'personalized-cake.html'),
      }
    }
  }
})
