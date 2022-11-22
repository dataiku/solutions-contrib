<template>
    <QLayout view="lHh lpR lFf" class="bg-white">
        
        <div class="toggle-left-button" :style="{ 'left' : leftDist + 'px'}">
            <div @click="toggleLeftPanel">
                <img src="../../assets/images/BtnImg.svg">
            </div>
        </div>
        

        <QHeader bordered class="bg-white" v-if="header">
            <slot name="header"></slot>
        </QHeader>

        <QDrawer v-model="showLeftPanel" side="left" bordered behavior="desktop">
            <slot name="leftpanel"></slot>
        </QDrawer>

        <QPageContainer>
            <slot name="content"></slot>    
        </QPageContainer>
    </QLayout>
</template>
<script>
    import { QLayout, QHeader, QDrawer, QPageContainer } from 'quasar';
    import btnImg from "../../assets/images/BtnImg.svg"
    export default {
        name:"BsLayoutDefault",
        data() {
            return {
                showLeftPanel : true,
                btnImg : btnImg,
            }  
        },
        components: {
            QLayout, 
            QHeader, 
            QDrawer, 
            QPageContainer
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