<template>

    <div id="myApplication">
      <div id="dataiku-logo"></div>
      <h1>Business Solutions</h1>
      <p>Start building your custom vue web app !</p>
      <img :src="image"/>
      
    </div>
</template>
  
<script>
  import image from "@/commons/_shared/resources/images/bs-logo.png"
  export default {
    name: 'app',
    data: function () {
            return {
                image: image,
            }
    }
  }
</script>
<style scoped src="../assets/css/helloworld.css">
</style>