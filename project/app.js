/* THIS IS A FILE TO TEST VUEJS */

const app = Vue.createApp({
    compilerOptions: {
      delimiters: ["[[", "]]"]
    },
    data() {
      return {
        count: 0
      }
    }
  })
  
  app.mount('#app')