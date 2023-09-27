<template>
  <div class="absolute-center items-center column no-wrap">
    <div id="dataiku-logo"></div>
    <h3>Dataiku Solutions</h3>
    <p>Start building your custom vue web app !</p>
    <img :src="image" />
  </div>
</template>

<script>
import image from "@/assets/images/bs-logo.png";
export default {
  name: "HelloWorld",
  data: function () {
    return {
      image: image,
    };
  },
};
</script>
<style scoped>
#dataiku-logo {
  background-image: url("@/assets/images/bs-logo.png");
  background-size: cover;
  width: 50px;
  height: 50px;
}
</style>
