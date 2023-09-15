
<template>
  <q-layout view="lHh LpR fFf">

    <q-header bordered class="header text-dark">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn class="bs-logo text-bold" key="logo" flat="flat" no-caps="no-caps" no-wrap="no-wrap" stretch="stretch" to="/"><img class="bs-logo__img" src="../assets/logo.svg"/></q-btn>
          Business solutions ui lib
        </q-toolbar-title>
        <q-space></q-space>
        <header-menu class="self-stretch row no-wrap" :version="version"></header-menu>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <app-menu class="q-mb-lg"></app-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue';
import HeaderMenu from './HeaderMenu.vue';
import { version } from 'ui';
import menu from "../assets/menu";
import AppMenu from './AppMenu.js';


export default {
  components: {
    HeaderMenu,
    AppMenu
  },
  setup () {
    const leftDrawerOpen = ref(false)
    console.log('Menu');
    console.log(menu);
    return {
      version,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
<style lang="sass">
@supports (backdrop-filter: none)
  .header
    background-color: rgba(0,0,0,.1)
    backdrop-filter: blur(7px)

@supports not (backdrop-filter: none)
  .header
    background-color: $grey-4
.bs-logo
  &__img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
    width: 34px
    height: 34px
    margin-right: 6px

  &:hover &__img
    transform: rotate(-360deg)

  &__logotype
    height: 19px
    vertical-align: middle
</style>