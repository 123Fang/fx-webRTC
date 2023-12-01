'use strict'
const path = require('path')

module.exports = {
	// publicPath: process.env.NODE_ENV === 'development' ? './' : '././',
	publicPath: './',
  outputDir: 'dist',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:18080', // 将目标地址替换为您要代理的实际后端API地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
  
}
