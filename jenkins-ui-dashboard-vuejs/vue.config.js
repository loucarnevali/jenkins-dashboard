module.exports = {
  devServer: {
      port: 8380,
      proxy: {
        "^/api": {
        target: 'http://localhost:8180',
        ws: true,
        changeOrigin: true
      }
   }
},
}