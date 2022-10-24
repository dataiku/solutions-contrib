<template>
    <div class="q-pa-md q-gutter-lg">
        <div class="row q-gutter-lg">
            <BsButtonToggleTest v-model="value" />
            <BsButtonToggleTest v-model="value" disable/>
            <BsButtonToggleTest v-model="value" size="xs" />
            <BsButtonToggleTest v-model="value" size="sm" />
            <BsButtonToggleTest v-model="value" size="md" />
            <BsButtonToggleTest v-model="value" size="lg" />
            <BsButtonToggleTest v-model="value" size="xl" />
        </div>
        <div class="row q-gutter-lg">
            <q-toggle v-model="value" />
            <q-toggle v-model="value" size="xs" />
            <q-toggle v-model="value" size="sm" />
            <q-toggle v-model="value" size="md" />
            <q-toggle v-model="value" size="lg" />
            <q-toggle v-model="value" size="xl" />
        </div>
        <div class="row q-gutter-lg">
            <p>A</p>
            <p>A</p>
            <p>A</p>
            <p>A</p>
            <p>A</p>
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