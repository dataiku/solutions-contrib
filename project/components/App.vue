<template>
    <div id="myApplication">
      <h1>Hello World</h1>
      <p>This is great</p>
      <img :src="image"/>
      <div id="bs-logo"></div>
    </div>
</template>
  
<script>
  // const image = new URL('../resources/dku-business-solutions.png',import.meta.url).href
  
  import image from "../resources/dku-business-solutions.png"
  import style from "../index.css"
  export default {
    name: 'app',
    data: function () {
            return {
                image: image,
            }
    }
  }
</script>


      