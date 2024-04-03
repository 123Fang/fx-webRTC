import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 相关rfc:  https://github.com/vitejs/vite/discussions/4921 --------------------------
  // 解决 @mediapipe/selfie_segmentation生产打包的Bug
  optimizeDeps: {
    disabled: false
  },
  build: {
    commonjsOptions: {
      include: []
    },
    // https://github.com/vitejs/vite/discussions/4921 --------------------------
    minify: false,
    lib: {
      entry: {
        sfs: 'src/main.js',
      },
      name: 'sfs'
    }
  }
})
