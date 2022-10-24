<template>
    <div class="q-pa-md q-gutter-lg">
        <div>
            <BsButtonToggle name="VueToggle" @toggle="doSomething" labelClass="dku-text" labelRight="Toggle me"/>
            <BsButtonToggleTest v-model="value"></BsButtonToggleTest>
        </div>
    </div>
</template>
<script>
import {BsButtonToggle} from "ui"
import {BsButtonToggleTest} from "ui";

export default {
  data() {
    return {
        value: true
    }
  },
  components: {
    BsButtonToggle,
    BsButtonToggleTest,
  },
  methods: {
    doSomething(value) {
      // value = true || false.
    }
  },
}
</script>