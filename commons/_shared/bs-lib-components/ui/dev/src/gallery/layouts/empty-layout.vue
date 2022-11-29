<template>
    <BsLayoutDefault :header="true" docTitle="Credit Scoring" docIcon="/imgs/doc-logo-example.svg">
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