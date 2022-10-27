<template>
    <q-page padding>
        <p class="q-mt-md">Primary</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn dku-text" unelevated>Fullscreen</BsButton>
            <BsButton class="bs-btn dku-text" unelevated icon="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn dku-text" unelevated icon-right="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn dku-text bs-btn-disabled" unelevated disable="">Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Secondary</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-outline dku-text" unelevated outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline dku-text" unelevated icon="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline dku-text" unelevated icon-right="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline dku-text bs-btn-disabled" unelevated disable outline>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Link</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-flat dku-text" unelevated flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat dku-text" unelevated icon="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat dku-text" unelevated icon-right="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat dku-text bs-btn-disabled" unelevated disable flat>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Contained Danger</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-danger dku-text" unelevated>Fullscreen</BsButton>
            <BsButton class="bs-btn-danger dku-text" unelevated icon="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn-danger dku-text" unelevated icon-right="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn-danger dku-text bs-btn-disabled" unelevated disable>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Oulined Danger</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-outline-danger dku-text" unelevated outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-danger dku-text" unelevated icon="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-danger dku-text" unelevated icon-right="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-danger dku-text bs-btn-disabled" unelevated disable outline>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Flat Danger</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-flat-danger dku-text" unelevated flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-danger dku-text" unelevated icon="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-danger dku-text" unelevated icon-right="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-danger dku-text bs-btn-disabled" unelevated disable flat>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Contained Succes</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-sucess dku-text" unelevated>Fullscreen</BsButton>
            <BsButton class="bs-btn-sucess dku-text" unelevated icon="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn-sucess dku-text" unelevated icon-right="fullscreen">Fullscreen</BsButton>
            <BsButton class="bs-btn-sucess dku-text bs-btn-disabled" unelevated disable>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Oulined Success</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-outline-success dku-text" unelevated outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-success dku-text" unelevated icon="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-success dku-text" unelevated icon-right="fullscreen" outline>Fullscreen</BsButton>
            <BsButton class="bs-btn-outline-success dku-text bs-btn-disabled" unelevated disable outline>Fullscreen</BsButton>
        </div>
        <p class="q-mt-md">Flat Success</p>
        <div class="q-gutter-sm">
            <BsButton class="bs-btn-flat-success dku-text" unelevated flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-success dku-text" unelevated icon="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-success dku-text" unelevated icon-right="fullscreen" flat>Fullscreen</BsButton>
            <BsButton class="bs-btn-flat-success dku-text bs-btn-disabled" unelevated disable flat>Fullscreen</BsButton>
        </div>
       

    </q-page>
</template>
<script>
    import { BsButton } from 'ui';

    export default {
        components: {
            BsButton, 
        }
    }
</script>