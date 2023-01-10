<template>
    <q-card class="doc-example q-my-lg" :class="classes" flat="flat" bordered="bordered">
        
        <div>
            <q-tabs class="doc-example__tabs" v-model="currentTab" align="left" no-caps="no-caps" :active-color="dark ? 'amber' : void 0" :indicator-color="dark ? 'amber' : 'primary'" dense="dense" :breakpoint="0">
                <q-tab v-for="tab in def.tabs" :key="`tab-${tab}`" :name="tab" :label="tab"></q-tab>
            </q-tabs>
            <q-separator></q-separator>
            <q-tab-panels class="text-grey-3 bg-grey-2 text-weight-regular" v-model="currentTab" animated="animated">
                <q-tab-panel class="q-pa-none" v-for="tab in def.tabs" :key="`pane-${tab}`" :name="tab">
                <doc-code lang="markup" :code="def.parts[tab]" max-height="70vh"></doc-code>
                </q-tab-panel>
            </q-tab-panels>
            <q-separator class="doc-example__separator"></q-separator>
        </div>
    </q-card>
</template>

<script>
import { onMounted } from 'vue'
import { ref, reactive, computed } from 'vue'

import {
  fabGithub
} from '@quasar/extras/fontawesome-v6'

import DocCode from './DocCode.vue'
import CardTitle from './CardTitle.vue'


 
export default {
  name: 'CodeSourceDisplay',

  components: {
    DocCode,
    CardTitle
  },

  props: {
    title: String,
    file: String,
    dark: Boolean,
    scrollable: Boolean,
    overflow: Boolean
  },

  setup (props) {
    

    const loadingSource = ref(true)
    
    const def = reactive({
      tabs: [],
      parts: {}
    })
    const currentTab = ref('Template')
   
    const classes = computed(() => {
      return props.dark === true
        ? 'doc-example--dark'
        : ''
    })

    const componentClass = computed(() => {
      return props.scrollable === true
        ? 'doc-example__content--scrollable scroll-y'
        : (props.overflow === true ? 'overflow-auto' : '')
    })

    
    function parseTemplate (target, template) {
      const
        string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || []

      return parsed[ 1 ] || ''
    }

    function parseComponent (comp) {
      def.parts = {
        Template: parseTemplate('template', comp),
        Script: parseTemplate('script', comp),
        Style: parseTemplate('style', comp)
      }

      const tabs = [ 'Template', 'Script', 'Style' ]
        .filter(type => def.parts[ type ])

      if (tabs.length > 1) {
        def.parts.All = comp
        tabs.push('All')
      }

      def.tabs = tabs
    }

    onMounted(() => {
        
      fetch(`/source-code/${ props.file }.vue`)
        .then(response => response.text())
        .then(content => {
          parseComponent(content)
          loadingSource.value = false
        })
    })

    return {
      fabGithub,


      loadingSource,
      currentTab,
      def,

      classes,
      componentClass,

    }
  }
}
</script>

<style lang="sass">
.doc-example
  &__tabs
    background: $grey-3
    color: $grey-7

  &--dark
    .doc-example__tabs
      background: $grey-9
      color: $grey-5

  &__content
    position: relative

    &--scrollable
      height: 500px
</style>
