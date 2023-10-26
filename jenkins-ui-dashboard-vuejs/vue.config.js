module.exports = {
  devServer: {
      port: 8380,
      proxy: {
        "^/api": {
        target: 'http://jenkins:8180',
        ws: true,
        changeOrigin: true
      }
   }
},
}