<template>
<q-layout class="doc-layout" view="lHh LpR lff" @scroll="onScroll">
    <q-header class="header text-dark" bordered="bordered">
      <q-toolbar class="q-px-none">
        <q-btn class="q-mx-sm lt-md" flat="flat" dense="dense" round="round" @click="toggleLeftDrawer" aria-label="Menu" :icon="mdiMenu"></q-btn>
        <q-btn class="quasar-logo text-bold" key="logo" flat="flat" no-caps="no-caps" no-wrap="no-wrap" stretch="stretch" to="/"><img class="quasar-logo__img" src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"/><img class="quasar-logo__logotype" src="https://cdn.quasar.dev/logo-v2/svg/logotype.svg"/></q-btn>
        <q-space></q-space>
        <header-menu class="self-stretch row no-wrap" v-if="$q.screen.gt.xs"></header-menu>
        <q-btn class="q-mx-xs" v-show="showRightDrawerToggler" flat="flat" dense="dense" round="round" @click="toggleRightDrawer" aria-label="Menu" :icon="mdiClipboardText"></q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer class="doc-left-drawer" side="left" v-model="leftDrawerState" show-if-above="show-if-above" bordered="bordered">
      <q-scroll-area style="height: calc(100% - 51px); margin-top: 51px">
        <template v-if="searchResults !== null">
          <component v-if="searchResults.masterComponent !== void 0" :is="searchResults.masterComponent"></component>
          <app-search-results v-else="v-else" :results="searchResults" :search-has-focus="searchHasFocus" :search-active-id="searchActiveId"></app-search-results>
        </template>
        <template v-else="v-else">
          <q-banner class="drawer-banner-bg">
            <div class="flex q-py-md justify-center">
              <q-btn href="https://bit.ly/qconf2022yt" target="_blank" color="primary" :icon="mdiYoutube" label="Watch Quasar Conf 2022" no-caps="no-caps"></q-btn>
            </div>
          </q-banner>
          <q-separator class="q-mb-lg"></q-separator>
          <div class="row justify-center q-my-md">
            <q-btn class="doc-layout__main-btn" href="https://donate.quasar.dev" target="_blank" rel="noopener" color="brand-primary" outline="outline" :icon="mdiHeart" label="Donate to Quasar" no-wrap="no-wrap" no-caps="no-caps"></q-btn>
          </div>
          <app-menu class="q-mb-lg"></app-menu>
        </template>
      </q-scroll-area>
      <div class="absolute-top header">
        <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
          <q-input class="full-width app-search-input" ref="searchInputRef" v-model="searchTerms" dense="dense" square="square" borderless="borderless" debounce="300" @keydown="onSearchKeydown" @focus="onSearchFocus" @blur="onSearchBlur" placeholder="Search Quasar v2..." type="search">
            <template v-slot:prepend="v-slot:prepend">
              <q-icon name="search"></q-icon>
            </template>
            <template v-slot:append="v-slot:append">
              <q-icon class="cursor-pointer" v-if="searchTerms" name="cancel" @click="onSearchClear"></q-icon>
              <div class="row items-center no-wrap no-pointer-events" v-else-if="!searchHasFocus"><kbd class="flex flex-center">/</kbd></div>
            </template>
          </q-input>
        </form>
        <q-separator></q-separator>
      </div>
    </q-drawer>
    <q-drawer v-if="hasRightDrawer" side="right" v-model="rightDrawerState" show-if-above="show-if-above" :width="220" @on-layout="updateRightDrawerOnLayout">
      <q-scroll-area class="fit">
        <header-menu class="q-mt-sm text-brand-primary column" v-if="$q.screen.lt.sm" align="right"></header-menu>
        <q-list class="doc-toc q-my-sm text-grey-8">
          <q-item v-for="tocItem in tocList" :key="tocItem.id" :id="'toc--'+tocItem.id" clickable="clickable" v-ripple="v-ripple" dense="dense" @click="scrollTo(tocItem.id)" :active="activeToc === tocItem.id">
            <q-item-section v-if="tocItem.sub === true" side="side">»</q-item-section>
            <q-item-section>{{ tocItem.title }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <q-page-scroller>
      <q-btn fab-mini="fab-mini" color="brand-primary" glossy="glossy" :icon="mdiChevronUp"></q-btn>
    </q-page-scroller>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import {
  mdiMenu, mdiClipboardText, mdiHeart, mdiMagnify, mdiChevronUp, mdiYoutube
} from '@quasar/extras/mdi-v6'

import AppMenu from 'components/AppMenu.js'
import AppSearchResults from 'components/AppSearchResults.vue'
// import SurveyCountdown from 'components/SurveyCountdown.vue'
import HeaderMenu from 'components/HeaderMenu.vue'

import useToc from './doc-layout/use-toc'
import useDrawers from './doc-layout/use-drawers'
import useScroll from './doc-layout/use-scroll'
import useSearch from './doc-layout/use-search'

export default {
  name: 'DocLayout',

  components: {
    AppMenu,
    AppSearchResults,
    // SurveyCountdown,
    HeaderMenu
  },

  setup () {
    const $q = useQuasar()
    const $route = useRoute()

    const scope = {
      mdiMenu,
      mdiClipboardText,
      mdiHeart,
      mdiMagnify,
      mdiChevronUp,
      mdiYoutube
    }

    useToc(scope, $route)
    useDrawers(scope, $q, $route)
    useScroll(scope, $route)
    useSearch(scope, $q, $route)

    return scope
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

.doc-layout__main-btn
  width: 200px

.q-drawer--mobile
  .doc-toc
    .q-item
      margin-left: 3px
    .q-item--active
      font-weight: 600

.doc-toc .q-item
  border-radius: 10px 0 0 10px
  margin-top: 1px
  margin-bottom: 1px
  font-size: 12px

  .q-item__section--side
    padding-right: 8px

  &.q-item--active
    background: scale-color($primary, $lightness: 90%)

.doc-left-drawer
  overflow: inherit !important

.quasar-logo
  &__img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
    width: 38px
    height: 38px
    margin-right: 8px
    border-radius: 50%

  &:hover &__img
    transform: rotate(-360deg)

  &__logotype
    height: 19px
    vertical-align: middle

.q-page-container :target
  scroll-margin-top: ($toolbar-min-height + 16px)

// keep the button on top of sticky in examples
.q-page-scroller > .q-page-sticky
  z-index: 1

.doc-layout
  .countdown
    .heading
      font-size: 18px
    .time
      font-size: 38px

.app-search-input,
.app-search-input .q-field__control
  height: 50px

.app-search-input
  .q-field__control
    padding: 0 18px 0 16px !important
  input
    line-height: 38px
  .q-field__prepend,
  .q-field__append
    height: 100%
    cursor: text !important
  kbd
    font-size: .6em !important
    min-width: 1.6em
    min-height: 1.5em
    font-weight: bold

body.mobile .app-search-input kbd
  display: none

.drawer-banner-bg
  background: linear-gradient(45deg, #e6f1fc 25%, #c3e0ff 25%, #c3e0ff 50%, #e6f1fc 50%, #e6f1fc 75%, #c3e0ff 75%, #c3e0ff)
  background-size: 40px 40px
</style>
