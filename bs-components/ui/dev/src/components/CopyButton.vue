<template>
    <div class="relative">
        <q-btn color="primary" round="round" dense="dense" flat="flat" :icon="mdiContentCopy" @click="copy">
            <q-tooltip>Copy to Clipboard</q-tooltip>
        </q-btn>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-badge class="absolute" v-show="copied" style="top: 8px; right: 58px;" color="primary">Copied to clipboard</q-badge>
        </transition>
    </div>
</template>
    
<script>
    import { ref } from 'vue'
    import { copyToClipboard } from 'quasar'
    import { mdiContentCopy } from '@quasar/extras/mdi-v6'

    export default {
        props: {
            text: String
        },

        setup (props) {
            let timer
            const copied = ref(false)

            function copy () {
            copyToClipboard(props.text)
                .then(() => {
                copied.value = true
                clearTimeout(timer)
                timer = setTimeout(() => {
                    copied.value = false
                    timer = null
                }, 2000)
                })
                .catch(() => {})
            }

            return {
            mdiContentCopy,
            copied,
            copy
            }
        }
    }
</script>
    