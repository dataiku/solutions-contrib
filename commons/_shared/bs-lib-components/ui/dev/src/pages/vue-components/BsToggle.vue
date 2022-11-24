<template>
    <div class="row q-pa-md q-gutter-lg">
      <div>
        
        <div class="q-gutter-lg">
            <p>Sizes :</p>
            <BsToggle v-model="value" />
            <BsToggle v-model="value" disable/>
            <BsToggle v-model="value" size="xs" />
            <BsToggle v-model="value" size="sm" />
            <BsToggle v-model="value" size="md" />
            <BsToggle v-model="value" size="lg" />
            <BsToggle v-model="value" size="xl" />
        </div>
      </div>
      <div>
        <div class="q-gutter-lg">
          <p>Left label</p>
          <BsToggle v-model="value" labelLeft="Widgets"/>
          <BsToggle v-model="value" size="xs" labelLeft="Widgets"/>
          <BsToggle v-model="value" size="sm" labelLeft="Widgets"/>
          <BsToggle v-model="value" size="md" labelLeft="Widgets"/>
          <BsToggle v-model="value" size="lg" labelLeft="Widgets"/>
          <BsToggle v-model="value" size="xl" labelLeft="Widgets"/>
        </div>
      </div>  
      <div>
        <div class="q-gutter-lg">
          <p>Right Label</p>
          <BsToggle v-model="value" labelRight="Widgets"/>
          <BsToggle v-model="value" size="xs" labelRight="Widgets"/>
          <BsToggle v-model="value" size="sm" labelRight="Widgets"/>
          <BsToggle v-model="value" size="md" labelRight="Widgets"/>
          <BsToggle v-model="value" size="lg" labelRight="Widgets"/>
          <BsToggle v-model="value" size="xl" labelRight="Widgets"/>
        </div>
      </div>  
      <div>
        <div class="q-gutter-lg">
          <p>Right & Left Label</p>
          <BsToggle v-model="value" labelRight="On" labelLeft="Off"/>
          <BsToggle v-model="value" size="xs" labelRight="On" labelLeft="Off"/>
          <BsToggle v-model="value" size="sm" labelRight="On" labelLeft="Off"/>
          <BsToggle v-model="value" size="md" labelRight="On" labelLeft="Off"/>
          <BsToggle v-model="value" size="lg" labelRight="On" labelLeft="Off"/>
          <BsToggle v-model="value" size="xl" labelRight="On" labelLeft="Off"/>
        </div>
      </div>  
      <div>
        <div class="q-gutter-lg">
          <p>Dynamic label</p>
          <BsToggle v-model="valueDynamic" trueValue="On" falseValue="Off" :labelLeft="valueDynamic"/>
        </div>
      </div> 
      <div>
        <div class="q-gutter-lg">
          <p>Array Model & custom colors</p>
          <BsToggle v-model="valueArray" val="default" />
          <BsToggle v-model="valueArray" val="red" color="red"/>
          <BsToggle v-model="valueArray" val="green" color="green"/>
          <BsToggle v-model="valueArray" val="black" color="black"/>
          <BsToggle v-model="valueArray" val="blue" color="blue"/>
        </div>
      </div>  
    </div>
</template>
<script>
import {BsToggle} from "ui";

export default {
  data() {
    return {
        value: true,
        valueDynamic: "Off",
        valueArray: []
    }
  },
  components: {
    BsToggle,
  },
  methods: {
    doSomething(value) {
      // value = true || false.
    }
  },
}
</script>