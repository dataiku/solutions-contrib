<template>
    <div class="q-pa-md q-gutter-lg">
        <div>
            <BsButtonToggle name="VueToggle" @toggle="doSomething" labelClass="dku-text" labelRight="Toggle me"/>
        </div>
    </div>
</template>
<script>
import {BsButtonToggle} from "ui"
export default {
  data() {
    return {
        value: true
    }
  },
  components: {
    BsButtonToggle
  },
  methods: {
    doSomething(value) {
      // value = true || false.
    }
  },
}
</script>