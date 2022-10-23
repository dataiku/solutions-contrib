<template>
    <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
            <q-select outlined v-model="model" :options="options"/>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),
      options: [
        'Extra small', 'Small', 'Medium', 'Large', 'Extra large','Custom'
      ]
    }
  }
}
</script>