<template>
    <q-btn-dropdown class="text-bold" :align="align" flat="flat" no-caps="no-caps" stretch="stretch" :label="`v${version}`" auto-close="auto-close">
        <q-list dense="dense" padding="padding">
            <q-item-label header="header">Latest (v{{ version }})</q-item-label>
            <q-item clickable="clickable" href="" target="_blank" rel="noopener">
                <q-item-section class="text-teal" avatar="avatar">
                    <q-icon :name="mdiClipboardText"></q-icon>
                </q-item-section>
                <q-item-section class="text-no-wrap">Release notes</q-item-section>
            </q-item>
            <q-item clickable="clickable" href="" target="_blank" rel="noopener">
            <q-item-section class="text-purple" avatar="avatar">
                <q-icon :name="mdiBugCheck"></q-icon>
            </q-item-section>
            <q-item-section class="text-no-wrap">Report a bug</q-item-section>
            </q-item>
            <q-item clickable="clickable" href="" target="_blank" rel="noopener">
            <q-item-section avatar="avatar">
                <q-icon :name="fabGithub"></q-icon>
            </q-item-section>
            <q-item-section>Repository</q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>
<script>
    import {
        mdiClipboardText, mdiBugCheck
    } from '@quasar/extras/mdi-v6';
    import { fabGithub } from '@quasar/extras/fontawesome-v6'
    export default {
        name: 'HeaderMenu',
        props: {
            align: String,
            version: String,
        },

        setup() {
            return {
                mdiClipboardText,
                mdiBugCheck,
                fabGithub
            }
        }
    }
</script>