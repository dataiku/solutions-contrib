<template>
    <q-layout view="lHh lpR lFf" class="bg-white">
        
        <div class="toggle-left-button" :style="{ 'left' : leftDist + 'px'}">
            <div @click="toggleLeftPanel">
                <img src="../../assets/images/BtnImg.svg">
            </div>
        </div>
        

        <q-header bordered class="bg-white" v-if="header">
            <slot name="header"></slot>
        </q-header>

        <q-drawer v-model="showLeftPanel" side="left" bordered behavior="desktop">
            <slot name="leftpanel"></slot>
        </q-drawer>

        <q-page-container>
            <slot name="content"></slot>    
        </q-page-container>
    </q-layout>
</template>
<script>
    import btnImg from "../../assets/images/BtnImg.svg"
    export default {
        name:"BsLayoutDefault",
        data() {
            return {
                showLeftPanel : true,
                btnImg : btnImg,
            }  
        },
        methods: {
            toggleLeftPanel() {
                this.showLeftPanel = !this.showLeftPanel;
            }
        },
        computed: {
            leftDist() {
                return this.showLeftPanel ? 300 : 0;
            }
        },
        props: {
            header: {
                type: Boolean,
                default: true
            }
        }
    }
</script>