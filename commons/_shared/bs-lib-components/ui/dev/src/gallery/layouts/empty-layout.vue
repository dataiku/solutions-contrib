<template>
    <BsLayoutDefault :header="true">
      <template #header>
        <div class="dku-medium-title-sb q-pa-md">Header</div>
      </template>
      <template #leftpanel>
        <div class="dku-medium-title-sb q-pa-md">Left Panel</div>
      </template>
      <template #content>
        <router-view />
      </template>
    </BsLayoutDefault>
</template>