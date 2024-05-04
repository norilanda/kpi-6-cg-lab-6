import { resolve } from 'path'

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cgLab51: resolve(__dirname, 'src/cg-lab5-1/index.html'),
        cgLab52: resolve(__dirname, 'src/cg-lab5-2/index.html'),
        cgLab531: resolve(__dirname, 'src/cg-lab5-3/index.html'),
        cgLab532: resolve(__dirname, 'src/cg-lab5-4/index.html'),
      }
    }
  }
}