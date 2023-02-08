<template>
    <div class="row items-center q-col-gutter-md">
        <div class="col-xs-12 col-md-6" v-for="layout in layoutGallery" :key="layout.name">
        <q-card flat="flat" bordered="bordered">
            <div class="row items-center no-wrap q-px-md q-py-sm">
            <div>{{ layout.name }}</div>
            <q-space></q-space>
            <q-btn :href="layout.demoLink" target="_blank" size="12px" flat="flat" round="round" color="primary" :icon="mdiOpenInNew"></q-btn>
            </div>
            <q-separator></q-separator>
            <div class="overflow-hidden"><a :href="layout.demoLink" target="_blank">
                <q-img alt="Layout Screenshot" :src="layout.screenshot" fit="contain" :ratio="1.95"></q-img></a></div>
        </q-card>
        </div>
    </div>
</template>
<script>
import { mdiCodeTags, mdiOpenInNew } from '@quasar/extras/mdi-v6'

import { layoutGallery } from '../router/routes'

export default {
  name: 'LayoutGalleryGrid',

  setup () {
    return {
      layoutGallery,
      mdiCodeTags,
      mdiOpenInNew
    }
  }
}
</script>