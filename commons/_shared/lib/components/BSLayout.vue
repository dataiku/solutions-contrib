<template>
    <q-layout view="lHh lpR lFf">
  
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
        </q-toolbar>
      </q-header>
  
      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <!-- drawer content -->
      </q-drawer>
  
      <q-page-container>
        <!-- Page content -->
      </q-page-container>
  
    </q-layout>
</template>
  
<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>